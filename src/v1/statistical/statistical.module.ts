import { Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { BookingModule } from '../booking/booking.module';

@Module({
    imports: [
        BookingModule
    ],
    providers: [StatisticalService],
    controllers: [StatisticalController]
})
export class StatisticalModule { }
