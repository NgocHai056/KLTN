import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class TheaterDto {
    @ApiProperty({
        example: "Touch cinema!",
        description: ""
    })
    @IsNotEmptyString()
    readonly name: string;

    @ApiProperty({
        example: "Đây là địa chỉ của rạp chiếu phim",
        description: ""
    })
    @IsNotEmptyString()
    readonly address: string;

}
