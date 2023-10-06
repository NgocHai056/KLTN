import { ApiProperty } from "@nestjs/swagger";
import { User } from "../user.entity/user.entity";

export class UserResponse {
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
        this.name = entity.name;
        this.phone = entity.phone;
        this.email = entity.email;
    }
}
