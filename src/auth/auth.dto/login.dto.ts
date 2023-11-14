import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmptyString, IsStrongPassword } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class LoginDto {
    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsEmail()
    readonly email: string;


    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmptyString()
    @IsStrongPassword()
    password: string;
}
