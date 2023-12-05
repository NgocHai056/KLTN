import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsInt, Min } from "../utils.decorator.common/utils.decorator.common";

export class PaginationAndSearchDto {
    @ApiProperty({
        example: 1,
        default: 1,
        description: "Số trang hiện tại cần xem"
    })
    @Min()
    @IsInt()
    page: number = 1;

    @ApiProperty({
        example: 5,
        default: 999,
        description: "Số lượng record trả về trên 1 request"
    })
    @Min()
    @IsInt()
    page_size: number = 999;

    @ApiProperty({
        example: "Muốn search gì thì search thôi",
        default: '',
        description: "Key word để search đó."
    })
    @IsString()
    key_search: string = '';
}