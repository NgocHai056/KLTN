import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetShowtimeByMovieDto {
    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Id rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_id: string;

    @ApiProperty({
        example: "6520df57ab169d8edbcd4f48",
        description: "Id phim."
    })
    @IsNotEmptyString()
    movie_id: string;
}
