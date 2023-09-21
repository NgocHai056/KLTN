import { Module } from '@nestjs/common';
import { TicketPriceService } from './ticket-price.service';
import { TicketPriceController } from './ticket-price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPrice } from './ticket-price.entity/ticket-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketPrice])
  ],
  providers: [TicketPriceService],
  controllers: [TicketPriceController],
  exports: [TicketPriceService]
})
export class TicketPriceModule { }
