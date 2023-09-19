import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class GetMoviesDto {

    @ApiProperty({
        example: 1,
        default: -1,
        description: "Thể loại phim"
    })
    @IsInt()
    genre_id: number = -1;

    @ApiProperty({
        example: 1,
        default: -1,
        description: "Danh sách phim theo trạng thái: đang chiếu, sắp chiếu,... Mặc định -1 sẽ lấy tất cả, 1 là đang chiếu, 2 là sắp chiếu"
    })
    @IsInt()
    status: number = -1;

    @ApiProperty({
        example: "The nun 2",
        description: "Có thể search theo tên, thể loại, đạo diễn, diễn viên,... blabla"
    })
    key_search: string = '';
}