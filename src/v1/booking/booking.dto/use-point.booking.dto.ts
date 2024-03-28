import { ApiProperty } from "@nestjs/swagger";
import { Max } from "class-validator";
import {
    IsNotEmptyString,
    Min,
    ValidateNested,
} from "src/utils.common/utils.decorator.common/utils.decorator.common";

class SeatDto {
    @ApiProperty({
        example: "1",
        description: "Số ghế của trong 1 phòng.",
    })
    @IsNotEmptyString()
    seat_number: string;
}

export class BookingComboDto {
    @ApiProperty({
        example: "654b8f8617fb16cd5e0da7f9",
        description: "Combo Id.",
    })
    @IsNotEmptyString()
    combo_id: string;

    @ApiProperty({
        example: 10,
        description: "Quantity.",
    })
    @Min()
    @Max(10)
    quantity: number;
}

export class UsePointBookingDto {
    @ApiProperty({
        example: "65260f822f91993c64422e07",
        description: "Id booking",
    })
    @IsNotEmptyString()
    booking_id: string;

    @ApiProperty({
        example: [
            {
                seat_number: "1",
            },
        ],
        description: "Số ghế của phòng chiếu phim",
    })
    @ValidateNested(SeatDto)
    seats: SeatDto[];

    @ApiProperty({
        example: [
            {
                combo_id: "654b8f8617fb16cd5e0da7f9",
                quantity: 2,
            },
        ],
        description: "Loại thức ăn đồ uống đặt kèm.",
    })
    @ValidateNested(BookingComboDto)
    combos: BookingComboDto[];
}
