import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmptyString, Min } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class ReviewDto {
    @ApiProperty({
        example: "1",
        description: "Id phim"
    })
    @Min()
    movie_id: number;

    @ApiProperty({
        example: "5.0",
        description: "Vote sao"
    })
    @IsInt()
    rating: number;

    @ApiProperty({
        example: "The movie was wonderful",
        description: "Đây là nơi viết đánh giá phim"
    })
    @IsNotEmptyString()
    review: string;
}
