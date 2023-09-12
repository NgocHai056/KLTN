import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt } from "class-validator";

export class RoomDto {
    @ApiProperty({
        example: "1",
        description: "Id rạp chiếu phim"
    })
    @IsNotEmpty()
    @IsInt()
    theater_id: number;

    @ApiProperty({
        example: "123",
        description: "Số phòng của rạp chiếu phim"
    })
    @IsNotEmpty()
    room_number: string;

    @ApiProperty({
        example: 45,
        description: "Số ghế trống của 1 phòng"
    })
    @IsNotEmpty()
    @IsInt()
    seat_capacity: number;
}
