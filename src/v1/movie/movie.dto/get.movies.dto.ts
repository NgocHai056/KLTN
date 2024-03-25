import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsInt } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetMoviesDto {
    @ApiProperty({
        example: "65260f822f91993c64422e07",
        default: "",
        description: "Thể loại phim",
    })
    @IsString()
    genre_id: string = "";

    @ApiProperty({
        example: "65260f822f91993c64422e07",
        default: "",
        description: "Thể loại phim",
    })
    @IsString()
    genres: string = "";

    @ApiProperty({
        example: 1,
        default: -1,
        description:
            "Danh sách phim theo trạng thái: đang chiếu, sắp chiếu,... Mặc định -1 sẽ lấy tất cả, 1 là đang chiếu, 2 là sắp chiếu",
    })
    @IsInt()
    status: number = -1;
}
