import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { ApiOperation } from '@nestjs/swagger';
import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BannerDto } from "./banner.dto/banner.dto";
import { BannerService } from "./banner.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/banner' })
export class BannerController {
    constructor(private bannerService: BannerService) { }

    @Post()
    @ApiOperation({ summary: "API create banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() bannerDto: BannerDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bannerService.create(bannerDto));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @ApiOperation({ summary: "API update banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() bannerDto: BannerDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const banner = await this.bannerService.find(id);

        if (!banner)
            UtilsExceptionMessageCommon.showMessageError("Banner not exist.");

        response.setData(await this.bannerService.update(banner.id, bannerDto));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @ApiOperation({ summary: "API delete banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(
        @Body() ids: string[],
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bannerService.deleteMany(ids) ? "Delete successful" : "Unsuccessful");
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @ApiOperation({ summary: "API get list banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bannerService.findAll());
        return res.status(HttpStatus.OK).send(response);
    }
}
