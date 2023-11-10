import { ApiProperty } from '@nestjs/swagger';
import { IsString, Max } from 'class-validator';
import { IsNotEmptyString, Min } from 'src/utils.common/utils.decorator.common/utils.decorator.common';

export class ProductDto {

    @ApiProperty({
        example: "Popcorn",
        description: "Name of product"
    })
    @IsNotEmptyString()
    name: string;

    @ApiProperty({
        example: "description",
        description: "Description of product"
    })
    @IsNotEmptyString()
    description: string;

    @ApiProperty({
        example: 40000,
        description: "Price of product"
    })
    @Min()
    @Max(200000)
    price: number;
}