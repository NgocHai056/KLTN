import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BaseService from 'src/base.service/base.service';
import { PaymentStatus } from 'src/utils.common/utils.enum/payment-status.enum';
import { SeatStatus } from 'src/utils.common/utils.enum/seat-status.enum';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { Movie } from '../movie/movie.entity/movie.entity';
import { SeatService } from '../seat/seat.service';
import { TicketPriceService } from '../ticket-price/ticket-price.service';
import { BookingDto } from './booking.dto/booking.dto';
import { Booking } from './booking.entity/booking.entity';
import { UserModel } from '../user/user.entity/user.model';
import { ComboService } from '../combo/combo.service';

@Injectable()
export class BookingService extends BaseService<Booking> {
    constructor(
        private readonly ticketPriceService: TicketPriceService,
        private readonly seatService: SeatService,
        private readonly comboServie: ComboService,
        @InjectModel(Booking.name) private readonly bookingRepository: Model<Booking>
    ) {
        super(bookingRepository);
    }

    async createBooking(
        bookingDto: BookingDto, user: UserModel, theaterId: string, roomId: string, roomNumber: string, movie: Movie) {

        const dayOfWeek = new Date().getDay();
        /** Lấy danh sách giá tiền theo loại ghế sau đó map vào theo từng cặp key : value */
        const ticketPrice = await this.ticketPriceService.findByCondition({ day_of_week: dayOfWeek });

        if (ticketPrice.length === 0)
            UtilsExceptionMessageCommon.showMessageError("Ticket booking failed!");


        const combos = await this.comboServie.calculatePriceProduct(bookingDto.combos);

        let totalAmount = 0;

        combos.forEach(combo => totalAmount += combo.price * combo.quantity)

        const priceMap = {};
        ticketPrice[0].tickets.forEach(ticket => {
            priceMap[ticket.seat_type] = ticket.price;
        })

        /** Calculate total amount and format new object for seat_array of schema booking */
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
            theater_name: bookingDto.theater_name, theater_id: theaterId,
            user_id: user.id, email: user.email, user_name: user.name,
            movie_id: bookingDto.movie_id,
            movie_name: movie.name,
            format: movie.format,
            room_id: roomId,
            room_number: roomNumber,
            seats: seats,
            combos: combos,
            time: bookingDto.time,
            showtime: bookingDto.showtime,
            payment_method: bookingDto.payment_method, payment_status: PaymentStatus.PENDING,
            total_amount: totalAmount,
            expireAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        return await createdItem.save();
    }

    async confirm(booking: Booking): Promise<Booking> {

        if (!booking) {
            UtilsExceptionMessageCommon.showMessageError("Ticket completion failed!");
        }

        if (booking.payment_status === PaymentStatus.PAID) {
            UtilsExceptionMessageCommon.showMessageError("Tickets have been completed!");
        }

        /** Update status of seats and status of booking */
        await this.seatService.updateManySeat(booking.room_id, booking.movie_id, booking.time, booking.showtime, booking.seats.map(seat => seat.seat_number).flat());


        return await this.update(
            booking.id,
            {
                payment_status: PaymentStatus.PAID,
                $unset: { expireAt: 1 }
            }
        );
    }
}
