import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity/review.entity';
import { MovieModule } from '../movie/movie.module';
import { BookingModule } from '../booking/booking.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    MovieModule,
    BookingModule,
    UserModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule { }