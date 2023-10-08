import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, IsNotEmptyString, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class GetShowtimeDto {
    @ApiProperty({
        example: 1,
        description: "Id rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_id: string;

    @ApiProperty({
        example: "2023-06-05",
        description: "Lịch chiếu theo ngày."
    })
    @IsNotEmptyString()
    time: string;
}
