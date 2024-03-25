import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { GenreDto } from "./genre.dto/genre.dto";
import { GenreService } from "./genre.service";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/genre" })
export class GenreController {
    constructor(private genreService: GenreService) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create genre" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() genreDto: GenreDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        if (
            (
                await this.genreService.findByCondition({
                    name: {
                        $regex: new RegExp("^" + genreDto.name + "$", "i"),
                    },
                })
            ).length > 0
        ) {
            UtilsExceptionMessageCommon.showMessageError(
                "The category name already exists!",
            );
        }

        response.setData(await this.genreService.create(genreDto));

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API update genre" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() genreDto: GenreDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const genre = await this.genreService.find(id);
        if (!genre) {
            UtilsExceptionMessageCommon.showMessageError(
                "Category does not exist!",
            );
        }

        if (genre.name === genreDto.name) {
            UtilsExceptionMessageCommon.showMessageError(
                "The category name already exists!",
            );
        }

        genre.name = genreDto.name;

        response.setData(await this.genreService.update(id, genre));

        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @ApiOperation({ summary: "API get list genre" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.genreService.findAll());

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get genre by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param("id") id: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.genreService.find(id));

        return res.status(HttpStatus.OK).send(response);
    }
}
