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
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BannerService } from "./banner.service";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/banner' })
export class BannerController {
    constructor(private bannerService: BannerService) { }

    @Get("")
    @ApiOperation({ summary: "API get list banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bannerService.findAll());
        return res.status(HttpStatus.OK).send(response);
    }
}
