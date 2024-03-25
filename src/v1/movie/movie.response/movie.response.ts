import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../movie.entity/movie.entity";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";

export class MovieResponse {
    @ApiProperty({
        example: "Ác quỷ ma sơ 2",
        description: "",
    })
    name: string;

    @ApiProperty({
        example: "The nun 2",
        description: "",
    })
    english_name: string;

    @ApiProperty({
        example: "Horror",
        description: "Thể loại phim",
    })
    genres: string;

    @ApiProperty({
        example: "2D",
        description: "Định dạng phim",
    })
    format: string;

    @ApiProperty({
        example: "T16",
        description: "Độ tuổi",
    })
    age: string;

    @ApiProperty({
        example: "",
        description: "",
    })
    title: string;

    @ApiProperty({
        example: "08/09/2023",
        description: "Thời gian phát hành",
    })
    release: string;

    @ApiProperty({
        example: "110 phút",
        description: "Thời lượng phim",
    })
    duration: string;

    @ApiProperty({
        example: "Michael Chaves",
        description: "Đạo diễn",
    })
    director: string;

    @ApiProperty({
        example: "Taissa Farmiga, Bonnie Aarons, Anna Popplewell",
        description: "Diễn viên",
    })
    performer: string;

    @ApiProperty({
        example: "Ác quỷ Valak lần nữa quay trở lại.",
        description: "Mô tả của phim",
    })
    description: string;

    @ApiProperty({
        example: "",
        description: "Ảnh của phim",
    })
    poster: string;

    @ApiProperty({
        example: "",
        description: "Ảnh thu nhỏ của trailer phim",
    })
    thumbnail: string;

    @ApiProperty({
        example: "",
        description: "Video ngắn giới thiệu phim.",
    })
    trailer: string;

    @ApiProperty({
        example: 4.5,
        description: "Đánh giá phim",
    })
    rating: number;

    constructor(entity: Movie) {
        this.name = entity ? entity.name : "";
        this.english_name = entity ? entity.english_name : "";
        this.title = entity ? entity.title : "";
        this.format = entity ? entity.format : "";
        this.age = entity ? entity.age : "";
        this.release = entity
            ? UtilsDate.formatDateVNToString(entity.release)
            : UtilsDate.formatDateVNToString(new Date());
        this.duration = entity ? entity.duration : "";
        this.director = entity ? entity.director : "";
        this.performer = entity ? entity.performer : "";
        this.description = entity ? entity.description : "";
        this.poster = entity ? entity.poster : "";
        this.thumbnail = entity ? entity.thumbnail : "";
        this.trailer = entity ? entity.trailer : "";
        this.rating = entity ? +entity.rating : 0;
    }

    public mapToList(entities: Movie[]): MovieResponse[] {
        const data: MovieResponse[] = [];
        entities.forEach((e) => {
            data.push(new MovieResponse(e));
        });
        return data;
    }
}
