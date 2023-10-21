import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsDateString } from "class-validator";
import { IsInt, IsNotEmpty, IsNotEmptyString, IsValidTimeFormat, ValidateNested } from "src/utils.common/utils.decorator.common/utils.decorator.common";
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
        description: "Loại vé đặt: 1: Trẻ em; 2: Học sinh, Sinh viên; 3: Người lớn"
    })
    @IsInt()
    @IsNotEmpty()
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
        description: "Phương thức thanh toán"
    })
    @IsInt()
    payment_method: number = 1;

}

