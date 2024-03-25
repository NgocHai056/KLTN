import { ApiProperty } from "@nestjs/swagger";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { Movie } from "src/v1/movie/movie.entity/movie.entity";

export class ShowtimeByDayResponse {
    @ApiProperty({
        example: "123",
        description: "Movie id",
    })
    _id: string;

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
        example: "",
        description: "Ảnh của phim",
    })
    poster: string;

    @ApiProperty({
        example: 4.5,
        description: "Đánh giá phim",
    })
    rating: number;

    @ApiProperty({
        example: [
            {
                showtime: "14:00",
                seat: {
                    _id: "your_seat_id",
                    room_id: "your_room_id",
                },
            },
        ],
        description: "Suất chiếu theo từng phim trong ngày",
    })
    times: any;

    constructor(entity: Movie) {
        this._id = entity ? entity._id : "";
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
        this.poster = entity ? entity.poster : "";
        this.rating = entity ? +entity.rating : 0;
    }

    public mapToList(entities: Movie[]): ShowtimeByDayResponse[] {
        const data: ShowtimeByDayResponse[] = [];
        entities.forEach((e) => {
            data.push(new ShowtimeByDayResponse(e));
        });
        return data;
    }
}
