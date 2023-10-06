import { ApiProperty } from "@nestjs/swagger";
import { Room } from "../room.entity/room.entity";

export class RoomResponse {

    @ApiProperty({
        example: "1",
        description: "Id rạp chiếu phim"
    })
    theater_id: string;

    @ApiProperty({
        example: "123",
        description: "Số phòng của rạp chiếu phim"
    })
    room_number: string;

    @ApiProperty({
        example: 45,
        description: "Số ghế trống của 1 phòng"
    })
    seat_capacity: number;

    constructor(entity?: Room) {
        this.theater_id = entity ? entity.theater_id : "";
        this.room_number = entity ? entity.room_number : "";
        this.seat_capacity = entity ? entity.seat_capacity : 0;
    }
}
