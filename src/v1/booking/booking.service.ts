import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Booking } from './booking.entity/booking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookingService extends BaseService<Booking> {
    constructor(@InjectModel(Booking.name) private readonly BookingRepository: Model<Booking>) {
        super(BookingRepository);
    }

    async createBooking() {

    }
}
