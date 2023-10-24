import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Booking } from './booking.entity/booking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketPriceService } from '../ticket-price/ticket-price.service';
import { BookingDto } from './booking.dto/booking.dto';
import { SeatService } from '../seat/seat.service';
import { SeatStatus } from 'src/utils.common/utils.enum/seat-status.enum';
import { PaymentStatus } from 'src/utils.common/utils.enum/payment-status.enum';

@Injectable()
export class BookingService extends BaseService<Booking> {
    constructor(
        private readonly ticketPriceService: TicketPriceService,
        private readonly seatService: SeatService,
        @InjectModel(Booking.name) private readonly bookingRepository: Model<Booking>
    ) {
        super(bookingRepository);
    }

    async createBooking(
        bookingDto: BookingDto, userId: string, userName: string, roomId: string, roomNumber: string, movieName: string) {

        /** Lấy danh sách giá tiền theo loại ghế sau đó map vào theo từng cặp key : value */
        const ticketPrice = await this.ticketPriceService.findByCondition({ type: { $in: bookingDto.seats.map(seat => seat.seat_type).flat() } });

        const priceMap = {};
        ticketPrice.forEach(ticket => {
            priceMap[ticket.type] = ticket.price;
        });

        /** Calculate total amount and format new object for seat_array of schema booking */
        let totalAmount = 0;
        const seats = bookingDto.seats.map(seat => {
            const price = priceMap[seat.seat_type];
            totalAmount += price;
            return { seat_number: seat.seat_number, seat_type: seat.seat_type, price: price };
        });

        /** Format object seat_array for update seat_array of showtime */
        const seatArray = bookingDto.seats.map(seat => {
            return { seat_number: seat.seat_number, status: SeatStatus.PENDING, seat_type: seat.seat_type, time_order: new Date(Date.now() + 10 * 60 * 1000) };
        });

        await this.seatService.createManySeat(roomId, bookingDto.movie_id, bookingDto.time, bookingDto.showtime, seatArray);

        const createdItem = new this.bookingRepository({
            theater_name: bookingDto.theater_name,
            user_id: userId, user_name: userName,
            movie_id: bookingDto.movie_id,
            movie_name: movieName,
            room_id: roomId,
            room_number: roomNumber,
            seats: seats,
            time: bookingDto.time,
            showtime: bookingDto.showtime,
            payment_method: bookingDto.payment_method, payment_status: PaymentStatus.PENDING,
            total_amount: totalAmount,
            expireAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        return await createdItem.save();
    }
}
