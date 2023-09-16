import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GenreDto {
    @ApiProperty({
        example: "Horror",
        description: "Name of the genre"
    })
    @IsNotEmptyString()
    readonly name: string;
}
