import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class UserUpdateDto {
    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmptyString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    @IsNotEmptyString()
    @IsOptional()
    @IsPhoneNumber('VN')
    readonly phone?: string;

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