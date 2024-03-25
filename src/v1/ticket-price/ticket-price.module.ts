import { Module } from "@nestjs/common";
import { TicketPriceService } from "./ticket-price.service";
import { TicketPriceController } from "./ticket-price.controller";
import {
    TicketPrice,
    TicketPriceSchema,
} from "./ticket-price.entity/ticket-price.entity";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TicketPrice.name, schema: TicketPriceSchema },
        ]),
    ],
    providers: [TicketPriceService],
    controllers: [TicketPriceController],
    exports: [TicketPriceService],
})
export class TicketPriceModule {}
