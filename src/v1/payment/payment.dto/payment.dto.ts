import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class PaymentDto {

    @ApiProperty({
        example: "6533a540b1cee6d6b62f520c",
        description: "Booking Id"
    })
    @IsNotEmptyString()
    booking_id: string;

    @ApiProperty({
        example: "vn",
        default: "vn",
        description: "Mã quốc gia"
    })
    @IsString()
    language: string = "vn";

}
