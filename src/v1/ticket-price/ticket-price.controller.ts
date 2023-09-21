import {
    Controller
} from "@nestjs/common";

import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';

import { TicketPriceService } from './ticket-price.service';

@Controller({ version: VersionEnum.V1.toString(), path: 'ticket-price' })
export class TicketPriceController {
    constructor(
        private readonly ticketPriceService: TicketPriceService,
    ) { }
}
