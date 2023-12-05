import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsDateString, IsEnum, IsString } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { MovieStatus } from "src/utils.common/utils.enum/movie-status.enum";

export class MovieDto {
    @ApiProperty({
        example: "Ác quỷ ma sơ 2",
        description: "Tên phim bằng tiếng Việt"
    })
    @IsNotEmptyString()
    name: string;

    @ApiProperty({
        example: "The nun 2",
        description: "Tên phim bằng tiếng Anh"
    })
    @IsString()
    english_name: string;

    @ApiProperty({
        example: ["1", "2"],
        description: "Thể loại phim"
    })
    @IsNotEmptyString()
    genres: string;

    @ApiProperty({
        example: "2D",
        description: "Định dạng"
    })
    @IsNotEmptyString()
    format: string;

    @ApiProperty({
        example: "T16+",
        description: "Độ tuổi tối thiểu có thể xem phim"
    })
    @IsNotEmptyString()
    age: string;

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

    @ApiProperty({
        example: "",
        description: "Video ngắn giới thiệu phim."
    })
    @IsString()
    trailer: string;

    @ApiProperty({
        example: "",
        description: "Danh sách phim theo trạng thái: đang chiếu, sắp chiếu,... Mặc định 0 là dừng chiếu, 1 là đang chiếu"
    })
    status: number = 1;
}
