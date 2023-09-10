import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;


    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
        message: 'Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    })
    password: string;
}
