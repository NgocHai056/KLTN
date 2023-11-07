import { ApiProperty } from "@nestjs/swagger";
import { UtilsBaseExceptionLangValidator } from "src/utils.common/utils.exception.lang.common/utils.base.exception.lang.validator";
import { Booking } from "../booking.entity/booking.entity";
import { PaymentMethod } from "src/utils.common/utils.enum/payment-method.enum";
import { PaymentStatus } from "src/utils.common/utils.enum/payment-status.enum";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { IsDateString } from "class-validator";

export class BookingResponse {

    @ApiProperty({
        example: "Tranquility",
        description: "Tên rạp chiếu phim"
    })
    theater_name: string;

    @ApiProperty({
        example: "Tranquility",
        description: ""
    })
    user_name: string;

    @ApiProperty({
        example: "The nun 2",
        description: "Tên phim"
    })
    movie_name: string;

    @ApiProperty({
        example: 1,
        description: "Số ghế của phòng chiếu phim"
    })
    room_number: string = '';

    @ApiProperty({
        example: [{
            seat_number: String,
            seat_type: Number,
            price: Number
        }],
        description: "Số ghế của phòng chiếu phim"
    })
    seats: { seat_number: string, seat_type: number, price: number }[];

    @ApiProperty({
        required: false,
        default: "",
        example: "2023-09-26 12:00:00.000",
        description: UtilsBaseExceptionLangValidator.exceptionStringDate(),
    })
    @IsDateString()
    readonly time: string;


    @ApiProperty({
        example: "0: Trả tiền mặt, 1: Chuyển khoản, 2: Credit card",
        description: "Phương thức thanh toán"
    })
    payment_method: string = '';

    @ApiProperty({
        example: "0: Chưa thanh toán, 1: Đã thanh toán, 2: Đã hủy",
        description: "Trạng thái thanh toán"
    })
    payment_status: string = '';

    @ApiProperty({
        example: 56000,
        description: "Tổng tiền"
    })
    total_amount: number;

    constructor(entity?: Booking) {
        this.user_name = entity ? entity.user_name : '';
        this.movie_name = entity ? entity.movie_name : '';
        this.room_number = entity ? entity.room_number : '';
        this.seats = entity ? entity.seats : [];
        this.time = entity ? entity.time + " " + entity.showtime : '';
        this.payment_method = entity ? PaymentMethod[entity.payment_method] : '';
        this.payment_status = entity ? PaymentStatus[entity.payment_status] : '';
        this.total_amount = entity ? +entity.total_amount : 0;
    }
}
