import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    ParseIntPipe,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BookingService } from "./booking.service";

@Controller({ version: VersionEnum.V1.toString(), path: 'booking' })
export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) { }

    @Get("/:id")
    @ApiOperation({ summary: "API get booking by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bookingService.findOne(id));
        return res.status(HttpStatus.OK).send(response);
    }
}
