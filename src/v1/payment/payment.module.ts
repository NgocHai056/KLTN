import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BookingModule } from '../booking/booking.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    BookingModule,
    MailModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule { }
