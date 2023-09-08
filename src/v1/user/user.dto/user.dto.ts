import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, Matches } from "class-validator";

export class UserDto {
    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmpty()
    readonly name: string;


    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
        message: 'Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    })
    password: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    readonly phone: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

}
