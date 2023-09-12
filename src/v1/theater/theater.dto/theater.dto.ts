import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TheaterDto {
    @ApiProperty({
        example: "Touch cinema!",
        description: ""
    })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        example: "Đây là địa chỉ của rạp chiếu phim",
        description: ""
    })
    @IsNotEmpty()
    readonly address: string;

}
