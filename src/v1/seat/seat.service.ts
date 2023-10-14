import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Seat } from './seat.entity/seat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { SeatResponse } from './seat.response/seat.response';

@Injectable()
export class SeatService extends BaseService<Seat> {
    constructor(@InjectModel(Seat.name) private readonly seatRepository: Model<Seat>) {
        super(seatRepository);
    }

    async createSeat(
        roomId: string, movieId: string, seatNumber: string, type: number,
        status: number, time: string, showtime: string
    ) {
        const condition = { room_id: roomId, movie_id: movieId, time: time, showtime: showtime };
        const seatArray = { seat_number: seatNumber, status: status, seat_type: +type };

        const seats = await this.seatRepository.find(condition).exec();

        if (seats.length === 0) {
            return await this.seatRepository.create({
                room_id: roomId,
                movie_id: movieId,
                time: time,
                showtime: showtime,
                seat_array: [seatArray] /** Chèn phần tử mới vào mảng `seats`*/
            });
        }

        /** Logic phía trên kiểm tra xem có document {seats} nào được tạo trong ngày {time}{showtime} và theo roomId, movieId chưa
         *  Nếu chưa thì thêm mới document. 
         *  Ngược lại thì kiểm tra xem ghế đó đã được đặt theo khung giờ {showtime},
         *  chưa có thì mới cập nhật vào document đó.
         */

        const filteredSeats = seats[0].seat_array
            .filter(item => item.seat_number === seatNumber) /** Chưa kiểm tra theo status */
            .map(item => item);

        if (filteredSeats.length === 0) {
            return await this.seatRepository.findOneAndUpdate(
                condition,
                { $push: { seat_array: seatArray } }, /** Sử dụng $push để thêm một phần tử mới*/
                { new: true } /**Tùy chọn này để trả về tài liệu đã cập nhật */
            ).exec();
        }

        UtilsExceptionMessageCommon.showMessageError("Save seat state failed!");
    }
}
