import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, IsNotEmptyString, IsValidTimeFormat, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

export class BookingDto {

    @ApiProperty({
        example: "Beta",
        description: "Tên rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_name: string;

    @ApiProperty({
        example: 1,
        description: "Id của phòng chiếu phim"
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
        example: 1,
        description: "Số ghế của phòng chiếu phim"
    })
    @IsNotEmptyString()
    seat_number: string;

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
    @IsValidTimeFormat()
    readonly showtime: string = '';

    @ApiProperty({
        example: 1,
        description: "Phương thức thanh toán"
    })
    payment_method: number = 1;

    @ApiProperty({
        example: 1,
        description: "Loại vé đặt: 1: Trẻ em; 2: Học sinh, Sinh viên; 3: Người lớn"
    })
    type: number = 2;
}
