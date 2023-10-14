import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { Seat, SeatSchema } from './seat.entity/seat.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seat.name, schema: SeatSchema }])
  ],
  providers: [SeatService],
  controllers: [SeatController],
  exports: [SeatService]
})
export class SeatModule { }
