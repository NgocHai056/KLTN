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
import { ApiOperation } from '@nestjs/swagger';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { GenreService } from "./genre.service";
import { GenreDto } from "./genre.dto/genre.dto";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";


@Controller({ version: VersionEnum.V1.toString(), path: 'genre' })
export class GenreController {
    constructor(private genreService: GenreService) { }

    @Post()
    @ApiOperation({ summary: "API create genre" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() genreDto: GenreDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        if ((await this.genreService.findBy({ name: genreDto.name })).length > 0) {
            UtilsExceptionMessageCommon.showMessageError("Tên thể loại đã tồn tại!");
        }

        response.setData(await this.genreService.create(genreDto))

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @ApiOperation({ summary: "API create genre" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() genreDto: GenreDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        if ((await this.genreService.findBy({ name: genreDto.name })).length > 0) {
            UtilsExceptionMessageCommon.showMessageError("Tên thể loại đã tồn tại!");
        }

        response.setData(await this.genreService.update(id, genreDto))

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get genre by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(await this.genreService.findOne(id))

        return res.status(HttpStatus.OK).send(response);
    }
}
