import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Genre } from './genre.entity/genre.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GenreService extends BaseService<Genre> {
    constructor(@InjectModel(Genre.name) private readonly genreRepository: Model<Genre>) {
        super(genreRepository);
    }
}
