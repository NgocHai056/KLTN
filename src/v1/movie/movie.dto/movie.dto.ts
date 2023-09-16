import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { IsInt, IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class MovieDto {
    @ApiProperty({
        example: "The nun 2",
        description: ""
    })
    @IsNotEmptyString()
    name: string;

    @ApiProperty({
        example: 0,
        description: "Thể loại phim"
    })
    @IsInt()
    genre_id: number;

    @ApiProperty({
        example: "",
        description: ""
    })
    title: string = '';

    @ApiProperty({
        example: "1997-10-20",
        description: "Thời gian phát hành"
    })
    @IsDateString()
    release: Date;

    @ApiProperty({
        example: "110 phút",
        description: "Thời lượng phim"
    })
    @IsNotEmptyString()
    duration: string;

    @ApiProperty({
        example: "Michael Chaves",
        description: "Đạo diễn"
    })
    @IsNotEmptyString()
    director: string;

    @ApiProperty({
        example: "Taissa Farmiga, Bonnie Aarons, Anna Popplewell",
        description: "Diễn viên"
    })
    @IsNotEmptyString()
    performer: string;

    @ApiProperty({
        example: "Ác quỷ Valak lần nữa quay trở lại.",
        description: "Mô tả của phim"
    })
    @IsNotEmptyString()
    description: string;
}
