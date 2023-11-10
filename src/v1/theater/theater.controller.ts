import {
    Controller,
    Get,
    Post,
    Body,
    HttpStatus,
    Param,
    ParseIntPipe,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { TheaterService } from './theater.service';
import { ApiOperation } from '@nestjs/swagger';
import { TheaterDto } from "./theater.dto/theater.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { TheaterResponse } from "./theater.response/theater.response";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/theater' })
export class TheaterController {
    constructor(private theaterService: TheaterService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() theaterDto: TheaterDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new TheaterResponse(await this.theaterService.create(theaterDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @ApiOperation({ summary: "API get list theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(TheaterResponse.mapToList(await this.theaterService.findAll()));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get theater by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new TheaterResponse(await this.theaterService.find(id)));
        return res.status(HttpStatus.OK).send(response);
    }
}
