import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity/booking.entity';
import { RoomModule } from '../room/room.module';
import { TicketPriceModule } from '../ticket-price/ticket-price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    RoomModule,
    TicketPriceModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule { }
