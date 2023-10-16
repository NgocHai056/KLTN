import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from '@nestjs/config';
import { AuthenticationMiddleware } from './utils.common/utils.middleware.common/utils.bearer-token.common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './v1/user/user.module';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { TicketPriceModule } from './v1/ticket-price/ticket-price.module';
import { BannerModule } from './v1/banner/banner.module';
import { TheaterModule } from './v1/theater/theater.module';
import { GenreModule } from './v1/genre/genre.module';
import { RoomModule } from './v1/room/room.module';
import { MovieModule } from './v1/movie/movie.module';
import { ReviewModule } from './v1/review/review.module';
import { BookingModule } from './v1/booking/booking.module';
import { ShowtimeModule } from './v1/showtime/showtime.module';
import { SeatModule } from './v1/seat/seat.module';
import { FacadeModule } from './facade/facade.module';
import { PaymentModule } from './v1/payment/payment.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        JwtModule.register({
            global: true,
            secret: process.env.secret_token
        }),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.CONFIG_MONGO_USERNAME}:${process.env.CONFIG_MONGO_PASSWORD
            }@cluster0.jil4did.mongodb.net/${process.env.CONFIG_MONGO_DB_NAME}?retryWrites=true&w=majority`,
            { autoIndex: true }
        ),
        UserModule,
        AuthModule,
        MailModule,
        OtpModule,
        TicketPriceModule,
        BannerModule,
        TheaterModule,
        GenreModule,
        RoomModule,
        MovieModule,
        ReviewModule,
        BookingModule,
        ShowtimeModule,
        SeatModule,
        FacadeModule,
        PaymentModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthenticationMiddleware,
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .exclude(
                { path: '/v1/oauth/*', method: RequestMethod.POST },
                { path: '/v1/unauth/*', method: RequestMethod.GET }
            )
            .forRoutes(
                { path: "/v1/auth/*", method: RequestMethod.ALL },
                { path: '/v1/unauth/*', method: RequestMethod.POST });
    }
}


/**
 * 1. Xử lý trạng thái chưa hoàn tất booking mà đã giữ ghế                      
 * 2. Kiểm tra tạo khoảng cách giữa các suất chiếu, validate showtime           #DONE
 * 3. Chỉ cho tạo lịch chiếu từ ngày hiện tại + T4          
 * 4. Reply review lồng nhau
 * 5. Xử lý seat_number. Khi mà user nhập set_number thì check xem đã tồn tại   #DONE
 * hay vượt quá seat_capacity của 1 phòng không
 * 
 */
