import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from '@nestjs/config';
import { AuthenticationMiddleware } from './utils.common/utils.middleware.common/utils.bearer-token.common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './v1/user/user.module';
import { TheaterModule } from './v1/theater/theater.module';
import { RoomModule } from './v1/room/room.module';
import { SeatModule } from './v1/seat/seat.module';
import { MovieModule } from './v1/movie/movie.module';
import { GenreModule } from './v1/genre/genre.module';
import { BookingModule } from './v1/booking/booking.module';
import { ShowtimeModule } from './v1/showtime/showtime.module';
import { TicketPriceModule } from './v1/ticket-price/ticket-price.module';
import { ReviewModule } from './v1/review/review.module';
import { PaymentModule } from './v1/payment/payment.module';
import { MailModule } from './mail/mail.module';
import { BannerModule } from './v1/banner/banner.module';


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
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.CONFIG_MYSQL_HOST,
            port: Number(process.env.CONFIG_MYSQL_PORT),
            username: process.env.CONFIG_MYSQL_USERNAME,
            password: process.env.CONFIG_MYSQL_PASSWORD,
            database: process.env.CONFIG_MYSQL_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"],
            multipleStatements: true,
            dateStrings: true,
        }),
        UserModule,
        AuthModule,
        TheaterModule,
        RoomModule,
        SeatModule,
        MovieModule,
        GenreModule,
        BookingModule,
        ShowtimeModule,
        TicketPriceModule,
        ReviewModule,
        PaymentModule,
        MailModule,
        BannerModule
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
                { path: '/auth/*', method: RequestMethod.POST },
                { path: '/movie/*', method: RequestMethod.GET },
                { path: '/banner/*', method: RequestMethod.GET })
            .forRoutes({ path: "/v1/*", method: RequestMethod.ALL });
    }
}
