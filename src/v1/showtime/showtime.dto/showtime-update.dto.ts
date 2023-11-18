import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { IsDateAfterNow, IsNotEmptyString, IsValidTimeFormat, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class ShowtimeUpdateDto {
    @ApiProperty({
        example: "652a1a14464026525552677c",
        description: "Id phòng chiếu phim"
    })
    @IsNotEmptyString()
    @IsOptional()
    room_id: string;

    @ApiProperty({
        example: "65260f822f91993c64422e07",
        description: "Id phim"
    })
    @IsNotEmptyString()
    @IsOptional()
    movie_id: string;

    @ApiProperty({
        required: false,
        default: "",
        example: "1997-10-20",
        description: UtilsBaseExceptionLangValidator.exceptionStringDate(),
    })
    @IsDateString()
    @IsOptional()
    readonly time: string = '';

    @ApiProperty({
        required: false,
        default: "",
        example: "10:15",
        description: UtilsBaseExceptionLangValidator.exceptionStringDate(),
    })
    @IsValidTimeFormat()
    @IsOptional()
    readonly showtime: string = '';
}
