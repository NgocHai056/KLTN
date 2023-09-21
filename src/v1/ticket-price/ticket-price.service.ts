import { Injectable } from '@nestjs/common';
import { TicketPrice } from './ticket-price.entity/ticket-price.entity';
import { BaseService } from 'src/base.service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class TicketPriceService extends BaseService<TicketPrice> {
    constructor(
        @InjectRepository(TicketPrice)
        private readonly ticketPriceRepository: Repository<TicketPrice>
    ) {
        super(ticketPriceRepository);
    }
}
