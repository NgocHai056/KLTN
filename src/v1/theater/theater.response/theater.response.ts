import { ApiProperty } from "@nestjs/swagger";
import { Theater } from "../theater.entity/theater.entity";

export class TheaterResponse {
    @ApiProperty({
        example: "Touch cinema!",
        description: ""
    })
    name: string;

    @ApiProperty({
        example: "Đây là địa chỉ của rạp chiếu phim!",
        description: ""
    })
    address: string;

    constructor(entity?: Theater) {
        this.name = entity ? entity.name : "";
        this.address = entity ? entity.address : "";
    }
}
