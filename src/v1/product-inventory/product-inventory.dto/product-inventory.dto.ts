import { ApiProperty } from "@nestjs/swagger";

export class ProductInventoryDto {
    @ApiProperty({
        example: "65201ff37ec42032a6e41b68",
        description: "Theater ID",
    })
    theater_id: string;

    @ApiProperty({
        example: "654b5811a952be8027133ef1",
        description: "Product ID",
    })
    product_id: string;

    @ApiProperty({
        example: 12,
        description: "Stock quantity",
    })
    stock_quantity: number;

    @ApiProperty({
        example: 30000,
        description: "Price of product",
    })
    price: number;
}
