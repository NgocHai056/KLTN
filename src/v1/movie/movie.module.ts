import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity/movie.entity';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    GenreModule
  ],
  providers: [MovieService],
  controllers: [MovieController]
})
export class MovieModule { }
