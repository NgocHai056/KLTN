import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import BaseService from "src/base.service/base.service";
import { PaymentStatus } from "src/utils.common/utils.enum/payment-status.enum";
import { SeatStatus } from "src/utils.common/utils.enum/seat-status.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ComboService } from "../combo/combo.service";
import { MemberService } from "../member/member.service";
import { Movie } from "../movie/movie.entity/movie.entity";
import { MovieService } from "../movie/movie.service";
import { SeatService } from "../seat/seat.service";
import { BookingStatisticDto } from "../statistical/statistic.dto/booking-statistic.dto";
import { TicketPriceService } from "../ticket-price/ticket-price.service";
import { UserModel } from "../user/user.entity/user.model";
import { BookingDto } from "./booking.dto/booking.dto";
import { Booking } from "./booking.entity/booking.entity";
import { UsePointBookingDto } from "./booking.dto/use-point.booking.dto";

@Injectable()
export class BookingService extends BaseService<Booking> {
    constructor(
        private readonly ticketPriceService: TicketPriceService,
        private readonly seatService: SeatService,
        private readonly comboServie: ComboService,
        private readonly movieService: MovieService,
        private readonly memberService: MemberService,
        @InjectModel(Booking.name)
        private readonly bookingModel: Model<Booking>,
    ) {
        super(bookingModel);
    }

    async usePoint(booking: Booking, bookingDto: UsePointBookingDto) {
        const seatsMap = {};
        const combosMap = {};

        booking.seats.forEach((seat) => (seatsMap[seat.seat_number] = seat));

        const seats = bookingDto.seats
            .map((seat) => seatsMap[seat.seat_number])
            .filter(Boolean);

        booking.combos.forEach((combo) => (combosMap[combo["id"]] = combo));

        const combos = bookingDto.combos
            .map((combo) => {
                const comboObject = combosMap[combo.combo_id];

                if (comboObject) {
                    if (combo.quantity > comboObject.quantity)
                        UtilsExceptionMessageCommon.showMessageError(
                            "Point exchange failed",
                        );
                    return {
                        ...comboObject.toObject(),
                        quantity: combo.quantity,
                    };
                }
            })
            .filter(Boolean);

        booking.discount_price = await this.memberService.usePoint(
            booking,
            seats,
            combos,
        );

        this.update(booking.id, booking);

        return true;
    }

    async createBooking(
        bookingDto: BookingDto,
        user: UserModel,
        theaterId: string,
        roomId: string,
        roomNumber: string,
        movie: Movie,
    ) {
        const dayOfWeek = new Date().getDay();
        /** Lấy danh sách giá tiền theo loại ghế sau đó map vào theo từng cặp key : value */
        const ticketPrice = await this.ticketPriceService.findByCondition({
            day_of_week: dayOfWeek,
            format: movie.format,
        });

        if (ticketPrice.length === 0)
            UtilsExceptionMessageCommon.showMessageError(
                "Ticket booking failed!",
            );

        const combos = await this.comboServie.calculatePriceProduct(
            bookingDto.combos,
        );

        let totalAmount = 0;

        combos.forEach(
            (combo) => (totalAmount += combo.price * combo.quantity),
        );

        const priceMap = {};
        ticketPrice[0].tickets.forEach((ticket) => {
            priceMap[ticket.seat_type] = ticket.price;
        });

        /** Calculate total amount and format new object for seat_array of schema booking */
        const seats = bookingDto.seats.map((seat) => {
            const price = priceMap[seat.seat_type];
            totalAmount += price;
            return {
                seat_number: seat.seat_number,
                seat_type: seat.seat_type,
                price: price,
            };
        });

        /** Format object seat_array for update seat_array of showtime */
        const seatArray = bookingDto.seats.map((seat) => {
            return {
                seat_number: seat.seat_number,
                status: SeatStatus.PENDING,
                seat_type: seat.seat_type,
                time_order: new Date(Date.now() + 10 * 60 * 1000),
            };
        });

        await this.seatService.createManySeat(
            roomId,
            bookingDto.movie_id,
            bookingDto.time,
            bookingDto.showtime,
            seatArray,
        );

        const createdItem = new this.bookingModel({
            theater_name: bookingDto.theater_name,
            theater_id: theaterId,
            user_id: user.id,
            email: user.email,
            user_name: user.name,
            movie_id: bookingDto.movie_id,
            movie_name: movie.name,
            format: movie.format,
            room_id: roomId,
            room_number: roomNumber,
            seats: seats,
            combos: combos,
            time: bookingDto.time,
            showtime: bookingDto.showtime,
            payment_method: bookingDto.payment_method,
            payment_status: PaymentStatus.PENDING,
            total_amount: totalAmount,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        return await createdItem.save();
    }

    async confirm(booking: Booking): Promise<Booking> {
        if (!booking) {
            UtilsExceptionMessageCommon.showMessageError(
                "Ticket completion failed!",
            );
        }

        if (booking.payment_status === PaymentStatus.PAID) {
            UtilsExceptionMessageCommon.showMessageError(
                "Tickets have been completed!",
            );
        }

        /** Update status of seats and status of booking */
        await this.seatService.updateManySeat(
            booking.room_id,
            booking.movie_id,
            booking.time,
            booking.showtime,
            booking.seats.map((seat) => seat.seat_number).flat(),
        );

        await this.memberService.updatePoint(
            booking.user_id,
            Math.round((booking.total_amount - booking.discount_price) / 1000),
            `${booking.theater_name} - ${booking.movie_name} - ${booking.user_name}`,
        );

        await this.memberService.minusPoint(booking.user_id, booking.movie_id);

        return await this.update(booking.id, {
            payment_status: PaymentStatus.PAID,
            $unset: { expireAt: 1 },
        });
    }

    private commonMatch = (
        theaterId: string,
        roomId: string,
        movieId: string,
        startOfDate: Date,
        endOfDate: Date,
    ) => {
        const query: any = {
            created_at: { $gte: startOfDate, $lte: endOfDate },
            payment_status: 1 /** Trạng thái thanh toán đã hoàn thành*/,
        };

        if (theaterId) query.theater_id = theaterId;

        if (roomId) query.room_id = roomId;

        if (movieId) query.movie_id = movieId;

        return query;
    };

    async calculateRevenueByHourInDay(revenueDto: BookingStatisticDto) {
        const hourData = Array.from({ length: 24 }, (_, index) => ({
            date: index,
            value: 0,
        }));

        const startOfDay = new Date(revenueDto.time);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(revenueDto.time);
        endOfDay.setHours(23, 59, 59, 999);

        const query = this.commonMatch(
            revenueDto.theater_id,
            revenueDto.room_id,
            revenueDto.movie_id,
            startOfDay,
            endOfDay,
        );

        const result = await this.bookingModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    hour: {
                        $hour: { $add: ["$created_at", 7 * 60 * 60 * 1000] },
                    },
                    totalAmount: "$total_amount",
                },
            },
            {
                $group: {
                    _id: { hour: "$hour" },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.hour",
                    value: "$totalRevenue",
                },
            },
            {
                $sort: { "_id.hour": 1 },
            },
        ]);

        return hourData.map((day) => {
            const match = result.find((item) => item.date === day.date);
            return match ? match : day;
        });
    }

    async calculateRevenueByDayInMonth(
        revenueDto: BookingStatisticDto,
        date: Date,
    ): Promise<any> {
        const daysInMonth = new Date(
            Date.UTC(date.getFullYear(), date.getMonth() + 1, 0),
        ).getDate(); // Lấy số ngày trong tháng
        const monthlyData = Array.from({ length: daysInMonth }, (_, index) => ({
            date: index + 1,
            value: 0,
        })); // Tạo mảng có số phần tử bằng số ngày trong tháng, ban đầu có giá trị 0 cho mỗi ngày

        const startOfMonth = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), 1),
        );
        const endOfMonth = new Date(
            Date.UTC(date.getFullYear(), date.getMonth() + 1, 0),
        );

        const query = this.commonMatch(
            revenueDto.theater_id,
            revenueDto.room_id,
            revenueDto.movie_id,
            startOfMonth,
            endOfMonth,
        );

        const result = await this.bookingModel.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$created_at" },
                    totalRevenue: { $sum: "$total_amount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    value: "$totalRevenue",
                },
            },
        ]);

        return monthlyData.map((day) => {
            const match = result.find((item) => item.date === day.date);
            return match ? match : day;
        });
    }

    async calculateRevenueByMonthInYear(
        revenueDto: BookingStatisticDto,
        year: number,
    ) {
        const yearlyData = Array.from({ length: 12 }, (_, index) => ({
            date: index + 1,
            value: 0,
        }));

        const startDate = new Date(year, 0, 1); // Ngày bắt đầu của năm
        const endDate = new Date(year + 1, 0, 0); // Ngày kết thúc của năm

        const query = this.commonMatch(
            revenueDto.theater_id,
            revenueDto.room_id,
            revenueDto.movie_id,
            startDate,
            endDate,
        );

        const result = await this.bookingModel.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: { $month: "$created_at" },
                    totalRevenue: { $sum: "$total_amount" },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    value: "$totalRevenue",
                },
            },
        ]);

        return yearlyData.map((day) => {
            const match = result.find((item) => item.date === day.date);
            return match ? match : day;
        });
    }

    async getOverallStatistics(theaterId?: string) {
        const query: any = {};

        if (theaterId) query.theater_id = theaterId;

        return await this.bookingModel.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: null,
                    total_revenue: { $sum: "$total_amount" },
                },
            },
        ]);
    }

    async getStatisticByMovie(theaterId?: string) {
        const query: any = {};

        if (theaterId) query.theater_id = theaterId;

        return await this.bookingModel.aggregate([
            {
                $match: query,
            },
            {
                $group: {
                    _id: "$movie_id",
                    movie_name: { $first: "$movie_name" },
                    total_revenue: { $sum: "$total_amount" }, // Tính tổng doanh thu
                    total_booking: { $sum: 1 }, // Đếm số lượng booking
                },
            },
            {
                $project: {
                    _id: 0,
                    movie_name: 1,
                    total_revenue: 1,
                    total_booking: 1,
                },
            },
        ]);
    }
}
