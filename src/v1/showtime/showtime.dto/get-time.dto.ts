import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class GetTimeDto {
    @ApiProperty({
        example: 1,
        description: "Id rạp chiếu phim"
    })
    @Min()
    theater_id: number;

    @ApiProperty({
        example: 1,
        description: "Id phim"
    })
    @Min()
    movie_id: number;
}
