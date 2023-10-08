import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "src/v1/movie/movie.entity/movie.entity";

export class ShowtimeResponse {

    @ApiProperty({
        example: "Ác quỷ ma sơ 2",
        description: ""
    })
    name: string;

    @ApiProperty({
        example: "The nun 2",
        description: ""
    })
    english_name: string;

    @ApiProperty({
        example: "Horror",
        description: "Thể loại phim"
    })
    genre_name: string;

    @ApiProperty({
        example: "2D",
        description: "Định dạng phim"
    })
    format: string;

    @ApiProperty({
        example: "T16",
        description: "Độ tuổi"
    })
    age: string;

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
        example: "",
        description: "Ảnh của phim"
    })
    poster: string;

    @ApiProperty({
        example: 4.5,
        description: "Đánh giá phim"
    })
    rating: number;

    @ApiProperty({
        example: ["12:00", "14:00"],
        description: "Suất chiếu theo từng phim trong ngày"
    })
    times: string[];

    constructor(entity: Movie) {
        this.name = entity ? entity.name : "";
        this.english_name = entity ? entity.english_name : "";
        this.title = entity ? entity.title : "";
        this.format = entity ? entity.format : "";
        this.age = entity ? entity.age : "";
        this.release = entity ? entity.release : new Date();
        this.duration = entity ? entity.duration : "";
        this.director = entity ? entity.director : "";
        this.performer = entity ? entity.performer : "";
        this.poster = entity ? entity.poster : "";
        this.rating = entity ? +entity.rating : 0;
    }

    public mapToList(entities: Movie[]): ShowtimeResponse[] {
        let data: ShowtimeResponse[] = [];
        entities.forEach(e => {
            data.push(new ShowtimeResponse(e))
        });
        return data;
    }
}
