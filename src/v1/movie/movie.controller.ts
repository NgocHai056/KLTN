import {
    Controller,
    Get,
    Post,
    Body,
    Query,
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
import { MovieService } from "./movie.service";
import { MovieResponse } from "./movie.response/movie.response";
import { GenreService } from "../genre/genre.service";
import { MovieDto } from "./movie.dto/movie.dto";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { Movie } from "./movie.entity/movie.entity";
import { GetMoviesDto } from "./movie.dto/get.movies.dto";
import { MovieStatus } from "src/utils.common/utils.enum/movie-status.enum";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/movie' })
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly genreService: GenreService
    ) { }

    @Get()
    @ApiOperation({ summary: "API lấy danh sách phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async get(
        @Query() movieDto: GetMoviesDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        let movies = await this.movieService.findMovies(movieDto.genre_id, +movieDto.status, movieDto.key_search);

        /** Lấy danh sách phim trừ những phim đã ngừng chiếu(status = 0) */
        movies = movies.filter(movie => movie.status !== MovieStatus.STOP_SHOWING);

        response.setData(movies);

        return res.status(HttpStatus.OK).send(response);
    }

    @Post()
    @Roles(Role.Admin)
    @ApiOperation({ summary: "API create movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() movieDto: MovieDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if (!await this.genreService.findByIds(movieDto.genres)) {
            UtilsExceptionMessageCommon.showMessageError("Category does not exist!");
        }

        response.setData(await this.movieService.create(movieDto));

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.Admin)
    @ApiOperation({ summary: "API update movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() movieDto: MovieDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if (!await this.genreService.findByIds(movieDto.genres)) {
            UtilsExceptionMessageCommon.showMessageError("Category does not exist!");
        }

        response.setData(await this.movieService.update(id, movieDto));

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get movie by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        let movie = await this.movieService.find(id);

        if (!movie || movie.status === MovieStatus.STOP_SHOWING) {
            UtilsExceptionMessageCommon.showMessageError("Movie does not exist!");
        }

        let result = new MovieResponse(movie);
        let genres = await this.genreService.findByIds(movie.genres);

        result.genres = genres.map(genre => genre.name).join(', ');

        response.setData(result);
        return res.status(HttpStatus.OK).send(response);
    }
}
