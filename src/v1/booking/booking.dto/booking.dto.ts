import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum } from "class-validator";
import { IsInt, IsNotEmptyString, IsValidTimeFormat, ValidateNested } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { PaymentMethod } from "src/utils.common/utils.enum/payment-method.enum";
import { SeatType } from "src/utils.common/utils.enum/seat-type.enum";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";

class SeatDto {

    @ApiProperty({
        example: "1",
        description: "Số ghế của trong 1 phòng."
    })
    @IsNotEmptyString()
    seat_number: string;

    @ApiProperty({
        example: 1,
        description: "Loại vé đặt: /** 0: Ghế bình thường, 1: Ghế đôi, 2: Ghế víp pro, 3: Ghế ưu tiên */"
    })
    @IsEnum(SeatType, {
        message: "seat_type must be one of the values: 0, 1, 2, 3",
    })
    seat_type: number;
}

export class BookingDto {

    @ApiProperty({
        example: "Beta",
        description: "Tên rạp chiếu phim"
    })
    @IsNotEmptyString()
    theater_name: string;

    @ApiProperty({
        example: "652a1a14464026525552677c",
        description: "Id của phòng chiếu phim"
    })
    @IsNotEmptyString()
    room_id: string;

    @ApiProperty({
        example: "65260f822f91993c64422e07",
        description: "Id phim"
    })
    @IsNotEmptyString()
    movie_id: string;

    @ApiProperty({
        example: [
            {
                seat_number: "1",
                seat_type: 1
            }
        ],
        description: "Số ghế của phòng chiếu phim"
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested(SeatDto)
    seats: SeatDto[];


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
        description: "Phương thức thanh toán 0: Trả tiền mặt, 1: Chuyển khoản, 2: Credit card"
    })
    @IsEnum(PaymentMethod, {
        message: "payment_method must be one of the values: 0, 1, 2",
    })
    payment_method: number = 1;

}

