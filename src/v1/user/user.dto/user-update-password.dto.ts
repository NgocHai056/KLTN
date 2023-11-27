import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsEmail, IsNotEmptyString, IsStrongPassword } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class UpdatePasswordDto {

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
    new_password: string;

    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmptyString()
    @IsStrongPassword()
    confirm_password: string;
}
