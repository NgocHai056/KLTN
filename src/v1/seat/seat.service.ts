import { Injectable } from '@nestjs/common';
import { ShowtimeService } from '../showtime/showtime.service';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class SeatService {
    constructor(
        private readonly showtimeService: ShowtimeService
    ) { }

    async createSeat(
        roomId: string, movieId: string, seatNumber: string, type: number,
        status: number, time: string, showtime: string
    ) {
        const seatArray = { seat_number: seatNumber, status: status, seat_type: +type };

        const showtimes = await this.showtimeService.checkExistShowtime([roomId], movieId, time, showtime);

        /** Update seat_array on schema showtime */
        return await this.showtimeService.update(
            showtimes[0].id,
            { $push: { seat_array: seatArray } }, /** Sử dụng $push để thêm một phần tử mới*/
        );
    }


    async checkEmptySeat(
        roomId: string, movieId: string, seatNumber: string, time: string, showtime: string
    ) {
        const showtimes = await this.showtimeService.checkExistShowtime([roomId], movieId, time, showtime);

        const existSeat = showtimes[0].seat_array.filter(seat => seat.seat_number === seatNumber);

        if (existSeat.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("Seats have been booked");
        }
    }
}
