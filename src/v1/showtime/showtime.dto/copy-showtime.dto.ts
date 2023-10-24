import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class CopyShowtimeDto {
    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Id rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_id: string;

    @ApiProperty({
        example: "2023-06-05",
        description: "Ngày cần sao chép lịch chiếu."
    })
    @IsDateString()
    time: string;

    @ApiProperty({
        example: "2023-06-06",
        description: "Ngày được sao chép lịch chiếu. Ví dụ như sao chép từ ngày 05/06 -> 06/06"
    })
    @IsDateString()
    target_time: string;
}
