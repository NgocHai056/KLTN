import { Injectable } from "@nestjs/common";
import BaseService from "src/base.service/base.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { TicketPrice } from "./ticket-price.entity/ticket-price.entity";

@Injectable()
export class TicketPriceService extends BaseService<TicketPrice> {
    constructor(
        @InjectModel(TicketPrice.name)
        private readonly ticketPriceRepository: Model<TicketPrice>,
    ) {
        super(ticketPriceRepository);
    }
}
