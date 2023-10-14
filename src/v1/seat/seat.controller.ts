import {
    Controller,
    Get,
    Post,
    Body,
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
import { Seat } from "./seat.entity/seat.entity";
import { SeatService } from "./seat.service";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/seat' })
export class SeatController {
    constructor(private seatService: SeatService,
    ) { }

    @Get("/:id")
    @ApiOperation({ summary: "API get seat by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        let seat: Seat = await this.seatService.find(id);

        response.setData(seat);
        return res.status(HttpStatus.OK).send(response);
    }
}
