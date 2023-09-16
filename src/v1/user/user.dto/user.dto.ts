import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, Matches } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class UserDto {
    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmptyString()
    readonly name: string;


    @ApiProperty({
        example: "#Matkhau056#",
        description: "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    })
    @IsNotEmptyString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
        message: 'Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    })
    password: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmptyString()
    @IsPhoneNumber('VN')
    readonly phone: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsEmail()
    @IsNotEmptyString()
    readonly email: string;

}
