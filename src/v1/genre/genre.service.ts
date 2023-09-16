import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Genre } from './genre.entity/genre.entity';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenreService extends BaseService<Genre> {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>
    ) {
        super(genreRepository);
    }
}
