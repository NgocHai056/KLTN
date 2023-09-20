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
import { StoreProcedureOutputResultInterface } from "src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common";
import { Movie } from "./movie.entity/movie.entity";
import { GetMoviesDto } from "./movie.dto/get.movies.dto";
import { MovieStatus } from "src/utils.common/utils.enum/movie-status.enum";

@Controller({ version: VersionEnum.V1.toString(), path: 'movie' })
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
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let movies: StoreProcedureOutputResultInterface<Movie, any> = await this.movieService.callStoredProcedure(
            "CALL sp_g_list_movie(?,?,?,@status,@message);"
            + "SELECT @status AS status_code, @message AS message_error",
            [movieDto.genre_id, movieDto.status, movieDto.key_search]);

        movies.list = movies.list.filter(movie => movie.status !== MovieStatus.STOP_SHOWING);

        response.setData(movies.list);

        return res.status(HttpStatus.OK).send(response);
    }

    @Post()
    @ApiOperation({ summary: "API create movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() movieDto: MovieDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        if (!await this.genreService.findOne(movieDto.genre_id)) {
            UtilsExceptionMessageCommon.showMessageError("Thể loại phim không tồn tại");
        }

        response.setData(await this.movieService.create(movieDto));

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get movie by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let movie = await this.movieService.findOne(id);

        if (movie.status === MovieStatus.STOP_SHOWING || !movie) {
            UtilsExceptionMessageCommon.showMessageError("Phim không tồn tại");
        }

        let result = new MovieResponse(movie);
        result.genre_name = (await this.genreService.findOne(movie.genre_id)).name;

        response.setData(result);
        return res.status(HttpStatus.OK).send(response);
    }
}
