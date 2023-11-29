import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class BannerDto {
    @ApiProperty({
        example: "Title",
        description: "Title of the banner"
    })
    @IsNotEmptyString()
    readonly title: string;
}
