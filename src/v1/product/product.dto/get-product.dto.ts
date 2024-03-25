import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsInt } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetProductDto {
    @ApiProperty({
        example: 1,
        description: "/** 1: Combo, 2: Nước, 3: Bắp*/",
    })
    @IsOptional()
    @IsInt()
    type: number;
}
