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

}
