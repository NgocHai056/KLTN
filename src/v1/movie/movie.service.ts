import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Movie } from './movie.entity/movie.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { PaginationAndSearchDto } from 'src/utils.common/utils.pagination/pagination-and-search.dto';

@Injectable()
export class MovieService extends BaseService<Movie> {
    constructor(
        @InjectModel(Movie.name) private readonly movieModel: Model<Movie>
    ) {
        super(movieModel);
    }

    async checkExisting(id: string): Promise<Movie> {
        const objectId = await this.validateObjectId(id, "MovieID");
        const movie = await this.movieModel.findById(objectId).exec();

        if (!movie) {
            UtilsExceptionMessageCommon.showMessageError("Movies do not exist!");
        }
        return movie;
    }

    async findMovieBeforeDateRelease(): Promise<Movie[]> {
        return await this.findByConditionWithLimit({ release: { $lte: new Date() } }, 10);
    }

    async findMovies(genres: string[], status: number, pagination: PaginationAndSearchDto, isAdmin: boolean = false) {
        const query: any = {};

        if (genres.length !== 0 && genres[0] !== '')
            query.genres = { $in: genres };

        if (!isAdmin)
            query.status = {
                $ne: 0
            }

        if (status === 1)
            query.release = {
                $lte: new Date()
            }
        else if (status === 2)
            query.release = {
                $gt: new Date()
            }

        const keySearch = pagination.key_search;

        if (keySearch !== '') {
            query.$or = [
                { name: { $regex: new RegExp(keySearch, 'i') } },
                { title: { $regex: new RegExp(keySearch, 'i') } },
                { duration: { $regex: new RegExp(keySearch, 'i') } },
                { director: { $regex: new RegExp(keySearch, 'i') } },
                { performer: { $regex: new RegExp(keySearch, 'i') } },
                { description: { $regex: new RegExp(keySearch, 'i') } },
            ];
        }

        const aggregationPipeline = [
            { $match: query },
            { $unwind: "$genres" /** Tách các thể loại thành từng dòng riêng biệt */ },
            {
                $addFields: {
                    "genres": { $toObjectId: "$genres" } /** Chuyển đổi chuỗi thành ObjectId*/
                }
            },
            {
                $lookup: {
                    from: "genres", /** Tên của collection thể loại*/
                    localField: "genres", /** Trường trong tài liệu phim chứa ObjectId thể loại*/
                    foreignField: "_id", /** Trường trong collection thể loại chứa ObjectId thể loại*/
                    as: "genre_info" /** Tên của trường sẽ lưu thông tin thể loại*/
                }
            },
            { $unwind: "$genre_info" /** Tách các kết quả thành từng dòng riêng biệt*/ },
            {
                $addFields: {
                    release: {
                        $dateToString: {
                            format: "%d/%m/%Y", // Định dạng ngày/tháng/năm theo ý muốn
                            date: "$release" // Trường ngày tháng cần định dạng
                        }
                    }
                }
            },
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
                    genres: { $push: "$genre_info.name" } /** Tạo mảng thể loại mới*/
                }
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
                                    else: { $concat: ["$$value", ", ", "$$this"] }
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    name: 1
                }
            }
        ];

        return await this.findAllForPagination(+pagination.page, +pagination.page_size, aggregationPipeline);
    }
}
