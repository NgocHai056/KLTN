import { ApiProperty } from "@nestjs/swagger";

export class TicketPriceDto {
    @ApiProperty({
        example: 1,
        description: "1: Trẻ em; 2: Học sinh, Sinh viên; 3: Người lớn"
    })
    readonly type: number;

    @ApiProperty({
        example: 55000,
        description: "Giá vé."
    })
    readonly price: number;
}
