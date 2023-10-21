import { ApiProperty } from "@nestjs/swagger";
import { Showtime } from "../showtime.entity/showtime.entity";
import { SeatStatus } from "src/utils.common/utils.enum/seat-status.enum";
import { SeatType } from "src/utils.common/utils.enum/seat-type.enum";


export class ShowtimeResponse {

    @ApiProperty({
        example: "652a1a52464026525552679c",
        description: "Showtime ID"
    })
    _id: string;

    @ApiProperty({
        example: "652a1a14464026525552677c",
        description: "Room ID"
    })
    room_id: string;

    @ApiProperty({
        example: "65260f822f91993c64422e07",
        description: "Movie ID"
    })
    movie_id: string;

    @ApiProperty({
        example: "2023-10-15",
        description: "Ngày chiếu phim"
    })
    time: string;

    @ApiProperty({
        example: "18:30",
        description: "Giờ chiếu phim"
    })
    showtime: string;

    @ApiProperty({
        type: [String],
        example: [
            {
                seat_number: 'A1',
                status: 1,
                seat_type: 2,
            }
        ],
        description: 'Mảng danh sách ghế với status: 0: Đang đặt, 1: Đã đặt, 2: Hủy. seat_type: 0: Ghế bình thường, 1: Ghế víp pro, 2: Ghế ưu tiên'
    })
    seat_array: { seat_number: string, status: number, seat_type: number }[];

    constructor(entity: Showtime) {
        this._id = entity ? entity._id : "";
        this.room_id = entity ? entity.room_id : "";
        this.movie_id = entity ? entity.movie_id : "";
        this.time = entity ? entity.time : "";
        this.showtime = entity ? entity.showtime : "";
    }

    public mapArraySeat(entities) {
        this.seat_array = entities.map(seat => ({
            seat_number: seat.seat_number,
            status: SeatStatus[seat.status],
            seat_type: SeatType[seat.seat_type]
        }));
    }
}