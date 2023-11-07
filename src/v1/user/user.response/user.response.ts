import { ApiProperty } from "@nestjs/swagger";
import { User } from "../user.entity/user.entity";

export class UserResponse {
    @ApiProperty({
        example: "652030e3435a945071eff98d",
        description: "Id user"
    })
    _id: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    name: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    phone: string;

    @ApiProperty({
        example: "Happy coding!",
        description: ""
    })
    email: string;

    constructor(entity?: User) {
        this._id = entity.id;
        this.name = entity.name;
        this.phone = entity.phone;
        this.email = entity.email;
    }
}
