import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity/room.entity';
import { TheaterModule } from '../theater/theater.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    TheaterModule
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService]
})
export class RoomModule { }
