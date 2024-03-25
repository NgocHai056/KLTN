import { Injectable } from "@nestjs/common";
import { SeatStatus } from "src/utils.common/utils.enum/seat-status.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ShowtimeService } from "../showtime/showtime.service";

@Injectable()
export class SeatService {
    constructor(private readonly showtimeService: ShowtimeService) {}

    async createManySeat(
        roomId: string,
        movieId: string,
        time: string,
        showtime: string,
        seatArray,
    ) {
        const showtimes = await this.showtimeService.checkExistShowtime(
            [roomId],
            movieId,
            time,
            showtime,
        );

        /** Update seat_array on schema showtime */
        return await this.showtimeService.update(
            showtimes[0].id,
            {
                $push: { seat_array: { $each: seatArray } },
            } /** Sử dụng $push để thêm một phần tử mới*/,
        );
    }

    async updateManySeat(
        roomId: string,
        movieId: string,
        time: string,
        showtime: string,
        seatArray: string[],
    ) {
        const showtimes = await this.showtimeService.checkExistShowtime(
            [roomId],
            movieId,
            time,
            showtime,
        );

        const newSeatArray = showtimes[0].seat_array.map((seat) => {
            if (seatArray.includes(seat.seat_number)) {
                seat.status = SeatStatus.COMPLETE;
            }
            return seat;
        });

        /** Update seat_array on schema showtime */
        return await this.showtimeService.update(showtimes[0].id, {
            $set: { seat_array: newSeatArray },
        });
    }

    async checkEmptySeat(
        roomId: string,
        movieId: string,
        seatNumber: string[],
        time: string,
        showtime: string,
    ) {
        const showtimes = await this.showtimeService.checkExistShowtime(
            [roomId],
            movieId,
            time,
            showtime,
        );

        const existSeat = showtimes[0].seat_array.filter((seat) =>
            seatNumber.includes(seat.seat_number),
        );

        if (existSeat.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError(
                "Seats have been booked",
            );
        }
    }
}
