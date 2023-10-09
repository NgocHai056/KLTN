import { Body, Controller, HttpStatus, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { Response } from "express";
import { TicketPriceService } from './ticket-price.service';
import { ApiOperation } from '@nestjs/swagger';
import { TicketPriceDto } from './ticket-price.dto/ticket-price.dto';
import { Role, Roles } from 'src/utils.common/utils.enum/role.enum';

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/ticket-price' })
export class TicketPriceController {
    constructor(
        private readonly ticketPriceService: TicketPriceService,
    ) { }

    @Post()
    @Roles(Role.Admin)
    @ApiOperation({ summary: "Create ticket price" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(
        @Body() ticketPriceDto: TicketPriceDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.ticketPriceService.create(ticketPriceDto));
        return res.status(HttpStatus.OK).send(response);
    }
}
