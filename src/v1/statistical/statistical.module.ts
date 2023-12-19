import { Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { BookingModule } from '../booking/booking.module';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        BookingModule,
        MovieModule,
        UserModule
    ],
    providers: [StatisticalService],
    controllers: [StatisticalController]
})
export class StatisticalModule { }
