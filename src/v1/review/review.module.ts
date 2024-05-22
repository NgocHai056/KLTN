import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { Review, ReviewSchema } from "./review.entity/review.entity";
import { MovieModule } from "../movie/movie.module";
import { BookingModule } from "../booking/booking.module";
import { UserModule } from "../user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MemberModule } from "../member/member.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
        ]),
        MovieModule,
        BookingModule,
        UserModule,
        MemberModule,
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}
