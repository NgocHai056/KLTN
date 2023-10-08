import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class BookingConfirmDto {
    @ApiProperty({
        example: 1,
        description: "BookingId"
    })
    @IsNotEmptyString()
    booking_id: string;
}
