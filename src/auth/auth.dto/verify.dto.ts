import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class VerifyDto {
    @ApiProperty({
        example: "123",
        description: "User ID"
    })
    @IsNotEmptyString()
    readonly user_id: string;


    @ApiProperty({
        example: "123456",
        description: "Mã OTP để xác thực tài khoản."
    })
    @IsNotEmptyString()
    otp: string;
}
