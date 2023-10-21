import { ApiProperty } from "@nestjs/swagger";
import { Seat } from "../seat.entity/seat.entity";

export class SeatResponse {
    @ApiProperty({
        example: "652a1a14464026525552677c",
        description: ""
    })
    room_id: string;

    @ApiProperty({
        example: "1",
        description: ""
    })
    seat_number: string;

    @ApiProperty({
        example: "1",
        description: "Loại ghế"
    })
    type: number;

    @ApiProperty({
        example: "2023-06-05",
        description: ""
    })
    time: string;

    constructor(entity?: Seat) {
        this.room_id = entity ? entity.room_id : "";
        // this.seat_number = entity ? entity.seat_number : "";
        // this.type = entity ? +entity.type : 0;
        this.time = entity ? entity.time : "";
    }

    public mapToList(entities: Seat[]): SeatResponse[] {
        let data: SeatResponse[] = [];
        entities.forEach(e => {
            data.push(new SeatResponse(e))
        });
        return data;
    }
}
