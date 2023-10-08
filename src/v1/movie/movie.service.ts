import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Movie } from './movie.entity/movie.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class MovieService extends BaseService<Movie> {
    constructor(@InjectModel(Movie.name) private readonly movieModel: Model<Movie>) {
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

    async findMovies(
        genreId?: string,
        status?: number,
        keySearch?: string,
    ): Promise<Movie[]> {
        const query: any = {};

        if (genreId !== '' && await this.validateObjectId(genreId, "genre_id"))
            query.genre_id = genreId;

        if (status !== -1)
            query.status = status;

        if (keySearch !== '') {
            if (!isNaN(Number(keySearch))) {
                query.rating = Number(keySearch);
            } else {
                query.$or = [
                    { name: { $regex: new RegExp(keySearch, 'i') } },
                    { title: { $regex: new RegExp(keySearch, 'i') } },
                    { duration: { $regex: new RegExp(keySearch, 'i') } },
                    { director: { $regex: new RegExp(keySearch, 'i') } },
                    { performer: { $regex: new RegExp(keySearch, 'i') } },
                    { description: { $regex: new RegExp(keySearch, 'i') } },
                ];
            }
        }

        return this.movieModel.find(query)
            .populate({ path: 'genre', select: 'name' })
            .exec();
    }
}
