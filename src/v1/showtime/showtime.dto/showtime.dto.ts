import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, IsNotEmptyString, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class ShowtimeDto {
    @ApiProperty({
        example: 1,
        description: "Id rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_id: string;

    @ApiProperty({
        example: 1,
        description: "Id phòng chiếu phim"
    })
    @IsNotEmptyString()
    room_id: string;

    @ApiProperty({
        example: 1,
        description: "Id phim"
    })
    @IsNotEmptyString()
    movie_id: string;

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
