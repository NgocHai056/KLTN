import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { ShowtimeModule } from '../showtime/showtime.module';

@Module({
  imports: [
    ShowtimeModule
  ],
  providers: [SeatService],
  controllers: [SeatController],
  exports: [SeatService]
})
export class SeatModule { }
