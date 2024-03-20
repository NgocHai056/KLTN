import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class PaymentDto {
    @ApiProperty({
        example: "6533a540b1cee6d6b62f520c",
        description: "Booking Id",
    })
    @IsNotEmptyString()
    booking_id: string;

    @ApiProperty({
        example: "https://nh-cinema.vercel.app/payment-detail",
        description:
            "Tham số return_url cho VNPAY navigation về 0: Wie, 1: Mobie",
    })
    return_url: number = 0;

    @ApiProperty({
        example: "vn",
        default: "vn",
        description: "Mã quốc gia",
    })
    @IsString()
    language: string = "vn";
}
