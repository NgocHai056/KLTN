import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray } from "class-validator";
import { IsInt, IsNotEmptyString, ValidateNested } from "src/utils.common/utils.decorator.common/utils.decorator.common";

class TicketDto {
    @ApiProperty({
        example: 1,
        description: "1: Trẻ em; 2: Học sinh, Sinh viên; 3: Người lớn"
    })
    @IsInt()
    readonly seat_type: number;

    @ApiProperty({
        example: 55000,
        description: "Giá vé."
    })
    @IsInt()
    readonly price: number;
}

export class TicketPriceDto {

    @ApiProperty({
        example: 1,
        description: "Ngày trong tuần: 0 -> 6"
    })
    @IsInt()
    day_of_week: number;

    @ApiProperty({
        example: 0,
        default: 0,
        description: "1: Ngày lễ, 0: Không phải ngày lễ"
    })
    is_holiday: number = 0;

    @ApiProperty({
        example: "2D",
        description: "Định dạng"
    })
    @IsNotEmptyString()
    format: string;

    @ApiProperty({
        example: [{
            type: 1,
            price: 55000
        }],
        description: ""
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested(TicketDto)
    tickets: TicketDto[];
}
