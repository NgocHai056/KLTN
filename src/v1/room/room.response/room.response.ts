import { ApiProperty } from "@nestjs/swagger";
import { Room } from "../room.entity/room.entity";

export class RoomResponse {

    @ApiProperty({
        example: "652a1a1b4640265255526784",
        description: "Id phòng phim"
    })
    id: string;

    @ApiProperty({
        example: "65203b82210d84d5c627f8b1",
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
        this.id = entity ? entity.id : "";
        this.theater_id = entity ? entity.theater_id : "";
        this.room_number = entity ? entity.room_number : "";
        this.seat_capacity = entity ? entity.seat_capacity : 0;
    }

    public static mapToList(entities: Room[]) {
        let data: RoomResponse[] = [];

        entities.forEach(e => {
            data.push(new RoomResponse(e));
        });

        return data;
    }
}
