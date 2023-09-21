import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity/showtime.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
  ],
  providers: [ShowtimeService],
  controllers: [ShowtimeController]
})
export class ShowtimeModule { }
