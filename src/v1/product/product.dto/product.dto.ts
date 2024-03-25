import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, Max } from "class-validator";
import {
    IsNotEmptyString,
    Min,
} from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { ComboType } from "src/utils.common/utils.enum/combo-type.enum";

export class ProductDto {
    @ApiProperty({
        example: "Popcorn",
        description: "Name of product",
    })
    @IsNotEmptyString()
    name: string;

    @ApiProperty({
        example: "description",
        description: "Description of product",
    })
    @IsNotEmptyString()
    description: string;

    @ApiProperty({
        example: 40000,
        description: "Price of product",
    })
    @Min()
    @Max(200000)
    price: number;

    @ApiProperty({
        example: 1,
        description: "/** 1: Combo, 2: Nước, 3: Bắp*/",
    })
    @IsEnum(ComboType, {
        message: "type must be one of the values: 1, 2, 3",
    })
    type: number;
}
