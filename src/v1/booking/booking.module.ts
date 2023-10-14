import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from './booking.entity/booking.entity';
import { RoomModule } from '../room/room.module';
import { TicketPriceModule } from '../ticket-price/ticket-price.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatModule } from '../seat/seat.module';
import { ShowtimeModule } from '../showtime/showtime.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    ShowtimeModule,
    SeatModule,
    RoomModule,
    TicketPriceModule,
    MovieModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule { }
