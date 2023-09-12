import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationMiddleware } from './utils.common/utils.middleware.common/utils.bearer-token.common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './v1/user/user.module';
import { TheaterModule } from './v1/theater/theater.module';
import { RoomModule } from './v1/room/room.module';


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
        RoomModule
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
                { path: '/v1/auth/register', method: RequestMethod.POST },
                { path: '/v1/auth/login', method: RequestMethod.POST })
            .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
