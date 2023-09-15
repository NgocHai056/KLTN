import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './seat.entity/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat]),
  ],
  providers: [SeatService],
  controllers: [SeatController]
})
export class SeatModule { }
