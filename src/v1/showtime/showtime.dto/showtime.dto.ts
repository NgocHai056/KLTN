import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class ShowtimeDto {
    @ApiProperty({
        example: 1,
        description: "Id rạp chiếu phim"
    })
    @Min()
    theater_id: number;

    @ApiProperty({
        example: 1,
        description: "Id phòng chiếu phim"
    })
    @Min()
    room_id: number;

    @ApiProperty({
        example: 1,
        description: "Id phim"
    })
    @Min()
    movie_id: number;

    @ApiProperty({
        required: false,
        default: "",
        example: "1997-10-20",
        description: UtilsBaseExceptionLangValidator.exceptionStringDate(),
    })
    @IsDateString()
    readonly time: string = '';

    @ApiProperty({
        required: false,
        default: "",
        example: "10:15",
        description: UtilsBaseExceptionLangValidator.exceptionStringDate(),
    })
    readonly showtime: string = '';
}
