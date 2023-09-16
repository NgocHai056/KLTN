import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Movie } from './movie.entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class MovieService extends BaseService<Movie>{
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>
    ) {
        super(movieRepository);
    }
}
