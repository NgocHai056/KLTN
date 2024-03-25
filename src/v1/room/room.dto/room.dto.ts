import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max } from "class-validator";
import {
    IsNotEmptyString,
    Min,
} from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class RoomDto {
    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Id rạp chiếu phim",
    })
    @IsNotEmptyString()
    @IsOptional()
    theater_id: string;

    @ApiProperty({
        example: "123",
        description: "Số phòng của rạp chiếu phim",
    })
    @IsNotEmptyString()
    @IsOptional()
    room_number: string;

    @ApiProperty({
        example: 45,
        description: "Tổng số ghế của 1 phòng",
    })
    @Min()
    @Max(84)
    @IsOptional()
    seat_capacity: number;
}
