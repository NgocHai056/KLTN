import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsInt } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetUserDto {

    @ApiProperty({
        example: 1,
        description: "USER = 0, MANAGER = 1, ADMIN = 2"
    })
    @IsOptional()
    @IsInt()
    role: number = -1;

}
