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
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
    UploadedFiles
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
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/movie' })
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly genreService: GenreService,
        private readonly firebaseService: FirebaseService
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
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'poster', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async create(
        @UploadedFiles() files: Record<string, any>,
        @Body() movieDto: MovieDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if (!files['poster'])
            UtilsExceptionMessageCommon.showMessageError("Poster is required.")

        if (!files['thumbnail'])
            UtilsExceptionMessageCommon.showMessageError("Thumbnail is required.")

        const genreDto = movieDto.genres.replace(/\s/g, '').split(',');
        if (!await this.genreService.findByIds(genreDto)) {
            UtilsExceptionMessageCommon.showMessageError("Category does not exist!");
        }

        const posterUrl = await this.firebaseService.uploadImageToFirebase(files['poster'][0]);
        const thumbnailUrl = await this.firebaseService.uploadImageToFirebase(files['thumbnail'][0]);

        const { genres, ...rest } = movieDto;

        response.setData(await this.movieService.create({ ...rest, genres: genreDto, poster: posterUrl, thumbnail: thumbnailUrl }));

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API update movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'poster', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]))
    async update(
        @Param("id") id: string,
        @UploadedFiles() files: Record<string, any>,
        @Body() movieDto: MovieDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const genreDto = movieDto.genres.replace(/\s/g, '').split(',');

        if (!await this.genreService.findByIds(genreDto)) {
            UtilsExceptionMessageCommon.showMessageError("Category does not exist!");
        }

        if (files['poster'])
            Object.assign(movieDto, { poster: await this.firebaseService.uploadImageToFirebase(files['poster'][0]), ...movieDto });

        if (files['thumbnail'])
            Object.assign(movieDto, { thumbnail: await this.firebaseService.uploadImageToFirebase(files['thumbnail'][0]), ...movieDto });

        const { genres, ...rest } = movieDto;

        response.setData(await this.movieService.update(id, { ...rest, genres: genreDto }));

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
