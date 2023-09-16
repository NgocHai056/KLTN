import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService]
})
export class GenreModule { }
