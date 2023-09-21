import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class BookingDto {
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

    @ApiProperty({
        example: 1,
        description: "Id ghế của phòng chiếu phim"
    })
    @IsInt()
    seat_id: number = -1;

    @ApiProperty({
        example: 1,
        description: "Số ghế của phòng chiếu phim"
    })
    @IsInt()
    seat_number: number = -1;

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

    @ApiProperty({
        example: 1,
        description: "Phương thức thanh toán"
    })
    @IsInt()
    payment_method: number = 0;
}
