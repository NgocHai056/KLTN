import { ApiProperty } from "@nestjs/swagger";
import { Seat } from "../seat.entity/seat.entity";

export class SeatResponse {
    @ApiProperty({
        example: "",
        description: ""
    })
    room_id: string;

    @ApiProperty({
        example: "",
        description: ""
    })
    seat_number: string;

    @ApiProperty({
        example: "",
        description: ""
    })
    type: number;

    @ApiProperty({
        example: "2023-06-05",
        description: ""
    })
    time: string;

    constructor(entity?: Seat) {
        this.room_id = entity ? entity.room_id : "";
        this.seat_number = entity ? entity.seat_number : "";
        this.type = entity ? +entity.type : 0;
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
