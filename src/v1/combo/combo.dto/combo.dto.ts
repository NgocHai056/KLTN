import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, Max } from "class-validator";
import {
    IsNotEmptyString,
    Min,
    ValidateNested,
} from "src/utils.common/utils.decorator.common/utils.decorator.common";

class ComboItemDto {
    @ApiProperty({
        example: "654b5811a952be8027133ef1",
        description: "Product ID.",
    })
    @IsNotEmptyString()
    product_id: string;

    @ApiProperty({
        example: 12,
        description: "Quantity of each element product",
    })
    @Min()
    @Max(3)
    quantity: number;
}

export class ComboDto {
    @ApiProperty({
        example: 56000,
        description: "Price of combo",
    })
    @Min()
    price: number;

    @ApiProperty({
        example: 100,
        description: "Exchange points for seat, item: pobcorn,.. combos",
    })
    @Min()
    exchange_point: number;

    @ApiProperty({
        example: [
            {
                product_id: "654b5811a952be8027133ef1",
                quantity: 2,
            },
        ],
        description: "Combo itmes",
    })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => ComboItemDto)
    @ValidateNested(ComboItemDto)
    combo_items: ComboItemDto[];
}
