import { ApiProperty } from "@nestjs/swagger";
import { Seat } from "../seat.entity/seat.entity";

export class SeatResponse {
    @ApiProperty({
        example: "",
        description: ""
    })
    room_id: number;

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
        example: "Happy coding!",
        description: ""
    })
    time: Date;

    constructor(entity?: Seat) {
        this.room_id = entity ? +entity.room_id : 0;
        this.seat_number = entity ? entity.seat_number : "";
        this.type = entity ? +entity.type : 0;
        this.time = entity ? entity.time : new Date();
    }

    public mapToList(entities: Seat[]): SeatResponse[] {
        let data: SeatResponse[] = [];
        entities.forEach(e => {
            data.push(new SeatResponse(e))
        });
        return data;
    }
}
