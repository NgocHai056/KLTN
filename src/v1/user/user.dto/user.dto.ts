import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, Matches } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { Role } from "src/utils.common/utils.enum/role.enum";

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

    @ApiProperty({
        example: 1,
        description: "USER = 0, MANAGER = 1, ADMIN = 2"
    })
    @IsEnum(Role, {
        message: "Role must be one of the values: 0, 1, 2",
    })
    @IsOptional()
    role: number;

    @ApiProperty({
        example: "65203b82210d84d5c627f8b1",
        description: "Theater ID"
    })
    @IsNotEmptyString()
    @IsOptional()
    theater_id: string;

    @ApiProperty({
        example: "2023-06-06",
        description: "Date of birth"
    })
    @IsDateString()
    @IsOptional()
    readonly date_of_birth?: string;

    @ApiProperty({
        example: "Female",
        description: "Gender of user"
    })
    @IsNotEmptyString()
    @IsOptional()
    readonly gender?: string;

}
