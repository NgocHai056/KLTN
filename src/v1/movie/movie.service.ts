import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import BaseService from "src/base.service/base.service";
import { MovieStatus } from "src/utils.common/utils.enum/movie-status.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { Movie } from "./movie.entity/movie.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import moment from "moment";
import { NotificationService } from "../notification/notification.service";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";

@Injectable()
export class MovieService extends BaseService<Movie> {
    constructor(
        private readonly notificationService: NotificationService,
        @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    ) {
        super(movieModel);
    }

    async checkExisting(id: string): Promise<Movie> {
        const objectId = await this.validateObjectId(id, "MovieID");
        const movie = await this.movieModel.findById(objectId).exec();

        if (!movie) {
            UtilsExceptionMessageCommon.showMessageError(
                "Movies do not exist!",
            );
        }
        return movie;
    }

    async findMovieDateRelease(): Promise<Movie[]> {
        const date = new Date();
        date.setDate(date.getDate() + 4);

        return await this.movieModel
            .find({
                status: { $ne: MovieStatus.STOP_SHOWING },
                release: { $lte: date },
            })
            .sort({ release: -1, created_at: -1 })
            .exec();
    }

    async findMovieBeforeDateRelease(): Promise<Movie[]> {
        const date = new Date();
        date.setDate(date.getDate() + 4);

        return await this.movieModel
            .find({
                status: { $ne: MovieStatus.STOP_SHOWING },
                release: { $lte: date },
            })
            .sort({ release: -1, created_at: -1 })
            .limit(5)
            .exec();
    }

    async findMovies(
        genres: string[],
        status: number,
        pagination: PaginationAndSearchDto,
        isAdmin: boolean = false,
    ) {
        const query: any = {};

        if (genres.length !== 0 && genres[0] !== "")
            query.genres = { $in: genres };

        if (!isAdmin)
            query.status = {
                $ne: 0,
            };

        if (status === 1)
            query.release = {
                $lte: new Date(),
            };
        else if (status === 2)
            query.release = {
                $gt: new Date(),
            };

        const keySearch = pagination.key_search;

        if (keySearch !== "") {
            query.$or = [
                { name: { $regex: new RegExp(keySearch, "i") } },
                { english_name: { $regex: new RegExp(keySearch, "i") } },
                { title: { $regex: new RegExp(keySearch, "i") } },
                { duration: { $regex: new RegExp(keySearch, "i") } },
                { director: { $regex: new RegExp(keySearch, "i") } },
                { performer: { $regex: new RegExp(keySearch, "i") } },
            ];
        }

        const aggregationPipeline = [
            { $match: query },
            {
                $unwind:
                    "$genres" /** Tách các thể loại thành từng dòng riêng biệt */,
            },
            {
                $addFields: {
                    genres: {
                        $toObjectId: "$genres",
                    } /** Chuyển đổi chuỗi thành ObjectId*/,
                },
            },
            {
                $lookup: {
                    from: "genres" /** Tên của collection thể loại*/,
                    localField:
                        "genres" /** Trường trong tài liệu phim chứa ObjectId thể loại*/,
                    foreignField:
                        "_id" /** Trường trong collection thể loại chứa ObjectId thể loại*/,
                    as: "genre_info" /** Tên của trường sẽ lưu thông tin thể loại*/,
                },
            },
            {
                $unwind:
                    "$genre_info" /** Tách các kết quả thành từng dòng riêng biệt*/,
            },
            // {
            //     $addFields: {
            //         release: {
            //             $dateToString: {
            //                 format: "%d/%m/%Y", // Định dạng ngày/tháng/năm theo ý muốn
            //                 date: "$release", // Trường ngày tháng cần định dạng
            //             },
            //         },
            //     },
            // },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    english_name: { $first: "$english_name" },
                    format: { $first: "$format" },
                    age: { $first: "$age" },
                    title: { $first: "$title" },
                    release: { $first: "$release" },
                    duration: { $first: "$duration" },
                    director: { $first: "$director" },
                    performer: { $first: "$performer" },
                    description: { $first: "$description" },
                    poster: { $first: "$poster" },
                    thumbnail: { $first: "$thumbnail" },
                    trailer: { $first: "$trailer" },
                    rating: { $first: "$rating" },
                    status: { $first: "$status" },
                    created_at: { $first: "$created_at" },
                    updated_at: { $first: "$updated_at" },
                    genre_ids: { $push: "$genre_info._id" },
                    genres: {
                        $push: "$genre_info.name",
                    } /** Tạo mảng thể loại mới*/,
                },
            },
            {
                $addFields: {
                    genres: {
                        $reduce: {
                            input: "$genres",
                            initialValue: "",
                            in: {
                                $cond: {
                                    if: { $eq: ["$$value", ""] },
                                    then: "$$this",
                                    else: {
                                        $concat: ["$$value", ", ", "$$this"],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    // name: 1,
                    release: isAdmin ? -1 : 1,
                },
            },
        ];

        const result = await this.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
            aggregationPipeline,
        );

        const data = result.data.map((movie) => {
            const date = UtilsDate.formatDateVNToString(
                new Date(movie.release),
            );

            return { ...movie, release: date };
        });

        return { data, total_record: result.total_record };
    }

    async findDocumentsExceptIds(ids: string[]): Promise<any[]> {
        const objectIds = ids.map((id) => new Types.ObjectId(id));

        return await this.movieModel
            .find({ _id: { $nin: objectIds }, release: { $lte: new Date() } })
            .sort({ created_at: -1 })
            .limit(10 - objectIds.length)
            .exec();
    }

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    async notificationMovieShowing() {
        const currentDate = moment();
        const nextDate = moment().add(1, "days");

        const movies = await this.findByCondition({
            release: {
                $gte: currentDate,
                $lt: nextDate,
            },
        });

        if (movies.length === 0) return;
    }
}
