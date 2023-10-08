import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { Showtime, ShowtimeSchema } from './showtime.entity/showtime.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { FacadeModule } from 'src/facade/facade.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Showtime.name, schema: ShowtimeSchema }]),
    FacadeModule,
    MovieModule
  ],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
  exports: [ShowtimeService]
})
export class ShowtimeModule { }
