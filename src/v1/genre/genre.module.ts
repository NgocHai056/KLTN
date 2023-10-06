import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { Genre, GenreSchema } from './genre.entity/genre.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService]
})
export class GenreModule { }
