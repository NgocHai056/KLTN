import { ApiProperty } from "@nestjs/swagger";

export class SeatShowtime {
    @ApiProperty({
        example: "[0,1]",
        description: "Trạng thái của ghế. 0 là còn trống, 1 là đã được đặt"
    })
    status: number;

    @ApiProperty({
        example: "2023-09-10 10:15:00.000",
        description: "Thời gian booking"
    })
    time: Date;
}