import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/v1/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { OtpModule } from 'src/otp/otp.module';
import { TheaterModule } from 'src/v1/theater/theater.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    OtpModule,
    TheaterModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
