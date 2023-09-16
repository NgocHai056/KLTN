import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../movie.entity/movie.entity";

export class MovieResponse {

    @ApiProperty({
        example: "The nun 2",
        description: ""
    })
    name: string;

    @ApiProperty({
        example: 0,
        description: "Thể loại phim"
    })
    genre_id: number;

    @ApiProperty({
        example: "",
        description: ""
    })
    title: string;

    @ApiProperty({
        example: "08/09/2023",
        description: "Thời gian phát hành"
    })
    release: Date;

    @ApiProperty({
        example: "110 phút",
        description: "Thời lượng phim"
    })
    duration: string;

    @ApiProperty({
        example: "Michael Chaves",
        description: "Đạo diễn"
    })
    director: string;

    @ApiProperty({
        example: "Taissa Farmiga, Bonnie Aarons, Anna Popplewell",
        description: "Diễn viên"
    })
    performer: string;

    @ApiProperty({
        example: "Ác quỷ Valak lần nữa quay trở lại.",
        description: "Mô tả của phim"
    })
    description: string;

    @ApiProperty({
        example: 4.5,
        description: "Đánh giá phim"
    })
    rating: number;

    constructor(entity?: Movie) {
        this.name = entity ? entity.name : "";
        this.genre_id = entity ? +entity.genre_id : 0;
        this.title = entity ? entity.title : "";
        this.release = entity ? entity.release : new Date();
        this.duration = entity ? entity.duration : "";
        this.director = entity ? entity.director : "";
        this.performer = entity ? entity.performer : "";
        this.description = entity ? entity.description : "";
        this.rating = entity ? +entity.rating : 0;

    }
}
