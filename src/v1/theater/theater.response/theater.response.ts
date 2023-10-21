import { ApiProperty } from "@nestjs/swagger";
import { Theater } from "../theater.entity/theater.entity";

export class TheaterResponse {

    @ApiProperty({
        example: "652a1a52464026525552679c",
        description: "Id rạp chiếu phim"
    })
    _id: string;

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
        this._id = entity ? entity._id : ""
        this.name = entity ? entity.name : "";
        this.address = entity ? entity.address : "";
    }

    public mapToList(entities: Theater[]): TheaterResponse[] {
        let data: TheaterResponse[] = [];
        entities.forEach(e => {
            data.push(new TheaterResponse(e))
        });
        return data;
    }
}
