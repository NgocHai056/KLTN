import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsEmail, IsNotEmptyString, IsStrongPassword } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class ForgotPasswordDto {

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

    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmptyString()
    @IsStrongPassword()
    @IsOptional()
    password: string;

    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmptyString()
    @IsStrongPassword()
    confirm_password: string;
}
