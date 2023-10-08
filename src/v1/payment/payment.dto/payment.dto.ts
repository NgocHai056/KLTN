import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsInt } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class PaymentDto {

    @ApiProperty({
        example: 56000,
        description: "Tổng tiền cần thanh toán"
    })
    @IsInt()
    amount: number;

    @ApiProperty({
        example: "ACB",
        description: "Mã code của ngân hàng"
    })
    @IsInt()
    bank_code: string;

    @ApiProperty({
        example: "vn",
        default: "vn",
        description: "Mã quốc gia"
    })
    @IsString()
    language: string = "vn";

}
