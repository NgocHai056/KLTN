import { ApiProperty } from "@nestjs/swagger";
import { User } from "../user.entity/user.entity";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";

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

    @ApiProperty({
        example: "05/06/2001",
        description: "Date of birth"
    })
    date_of_birth: string;

    @ApiProperty({
        example: "Male",
        description: "Gender"
    })
    gender: string;

    constructor(entity?: User) {
        this._id = entity.id;
        this.name = entity.name;
        this.phone = entity.phone;
        this.email = entity.email;
        this.date_of_birth = UtilsDate.formatDateVNToString(new Date(entity.date_of_birth));
        this.gender = entity.gender;
    }
}
