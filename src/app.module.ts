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
import { FacadeModule } from './v1/facade-theater/facade.module';
import { PaymentModule } from './v1/payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QrCodeModule } from './qr-code/qr-code.module';
import { ComboModule } from './v1/combo/combo.module';
import { ProductModule } from './v1/product/product.module';
import { ProductInventoryModule } from './v1/product-inventory/product-inventory.module';
import { DecoratorComboModule } from './v1/decorator-combo/decorator-combo.module';


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
        ScheduleModule.forRoot(),
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
        PaymentModule,
        QrCodeModule,
        ComboModule,
        ProductModule,
        ProductInventoryModule,
        DecoratorComboModule
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
                { path: '/v1/oauth/*', method: RequestMethod.GET },
                { path: "/v1/auth/*", method: RequestMethod.ALL },
                { path: '/v1/unauth/*', method: RequestMethod.POST });
    }
}


/**
 * 1. Xử lý trạng thái chưa hoàn tất booking mà đã giữ ghế                      #DONE
 * 2. Kiểm tra tạo khoảng cách giữa các suất chiếu, validate showtime           #DONE
 * 3. Chỉ cho tạo lịch chiếu từ ngày hiện tại + T4                              #DONE  
 *         
 * 
 * 5. Xử lý seat_number. Khi mà user nhập set_number thì check xem đã tồn tại   #DONE
 * hay vượt quá seat_capacity của 1 phòng không
 * 
 * 6. Khi nào từ phim đang chiếu -> sắp chiếu                                   #DONE
 * 
 * 7. Khoảng cách chiếu bằng thời gian chiếu bộ phim + 30' và có chức năng copy
 * chưa check trùng hay khoảng thời gian tạo
 * 4. Reply review lồng nhau
 * 
 * 8. Đặt nhiều ghế cùng lúc                                                    #DONE
 * 9. Định dạng thời gian                                                       #DONE
 * 10. Viết api lấy lịch chiếu theo từng phim                                   #DONE
 * 11. Trả về room_name cho lấy danh sách trạng thái ghế                        #DONE
 * 12. Validate 1 type, status trong khoảng cho phép                            #DONE
 * 
 * 13. Xử lý chỗ loại vé với loại ghế
 * 14. Gửi mail thông báo hoàn tất đặt vé
 * 15. Tạo mã QR gửi cùng khi đặt vé thành công hỗ trợ quét nhanh vé khi tới quầy
 * 16. Xử lý lưu ảnh vào DB thay vì lưu link
 * 17. Socket lúc người dùng chọn ghế
 * 
 * 
 * Tính năng: 
 * - Chẳng hạn như đề xuất phim tương tự, hiển thị thông báo 
 * về các suất chiếu sắp tới hoặc điều hướng người dùng đến phần khác của trang web.
 * - Tích hợp AI chatbox, map chỉ đường tới rạp.
 */
