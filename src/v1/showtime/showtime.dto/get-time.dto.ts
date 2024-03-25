import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetShowtimeDto {
    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Id rạp chiếu phim",
    })
    @IsNotEmptyString()
    theater_id: string;

    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Id phim",
    })
    @IsNotEmptyString()
    @IsOptional()
    movie_id: string;

    @ApiProperty({
        example: "2023-06-05",
        description: "Lịch chiếu theo ngày.",
    })
    @IsDateString()
    @IsOptional()
    time: string;
}
