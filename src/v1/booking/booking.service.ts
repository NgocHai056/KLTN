import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Booking } from './booking.entity/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class BookingService extends BaseService<Booking>{
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>
    ) {
        super(bookingRepository);
    }
}
