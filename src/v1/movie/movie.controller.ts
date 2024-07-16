import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { FirebaseService } from "src/firebase/firebase.service";
import { MovieStatus } from "src/utils.common/utils.enum/movie-status.enum";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { GenreService } from "../genre/genre.service";
import { GetMoviesDto } from "./movie.dto/get.movies.dto";
import { MovieDto } from "./movie.dto/movie.dto";
import { MovieResponse } from "./movie.response/movie.response";
import { MovieService } from "./movie.service";
import { ShowtimeService } from "../showtime/showtime.service";
import { Movie } from "./movie.entity/movie.entity";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { NotificationService } from "../notification/notification.service";
import * as moment from "moment-timezone";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/movie" })
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly genreService: GenreService,
        private readonly showtimeService: ShowtimeService,
        private readonly firebaseService: FirebaseService,
        private readonly notificationService: NotificationService,
    ) {}

    @Get()
    @ApiOperation({ summary: "API lấy danh sách phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async get(
        @Query() movieDto: GetMoviesDto,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const movies = await this.movieService.findMovies(
            [movieDto.genre_id],
            +movieDto.status,
            pagination,
        );

        // If movies are showing then filter movie by showtime
        if (+movieDto.status == MovieStatus.NOW_SHOWING) {
            const movieIds: string[] = movies.data.map((movie) => movie._id);

            const currentDate = moment();

            const nextDate = moment().add(3, "days");

            const movieHasShowtime = await this.showtimeService.findByCondition(
                {
                    movie_id: { $in: movieIds },
                    time: {
                        $gte: currentDate.format("YYYY-MM-DD"),
                        $lte: nextDate.format("YYYY-MM-DD"),
                    },
                },
            );

            const showtimeSet = new Set();

            movieHasShowtime.forEach((x) => showtimeSet.add(x.movie_id));

            const data = movies.data.filter((movie) =>
                showtimeSet.has(movie._id.toString()),
            );
            response.setData(data);
            response.setTotalRecord(data.length);
        } else {
            response.setData(movies.data);
            response.setTotalRecord(movies.total_record);
        }

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/manager")
    @ApiOperation({ summary: "API lấy danh sách phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async get_movie_name(
        @Query() movieDto: GetMoviesDto,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.movieService.findMovieDateRelease());

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/admin")
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "API lấy danh sách phim cho admin" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getForAdmin(
        @Query() movieDto: GetMoviesDto,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const result = await this.movieService.findMovies(
            movieDto.genres.replace(/\s/g, "").split(","),
            +movieDto.status,
            pagination,
            true,
        );

        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "poster", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
    )
    async create(
        @UploadedFiles() files: Record<string, any>,
        @Body() movieDto: MovieDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        if (
            (await this.movieService.findByCondition({ name: movieDto.name }))
                .length !== 0
        )
            UtilsExceptionMessageCommon.showMessageError(
                "Name of movie is exist!",
            );

        if (Number.isNaN(Number(movieDto.duration)))
            UtilsExceptionMessageCommon.showMessageError(
                "Duration must be number!",
            );

        if (!files["poster"])
            UtilsExceptionMessageCommon.showMessageError("Poster is required!");

        if (!files["thumbnail"])
            UtilsExceptionMessageCommon.showMessageError(
                "Thumbnail is required!",
            );

        const genreDto = movieDto.genres.replace(/\s/g, "").split(",");
        if (!(await this.genreService.findByIds(genreDto))) {
            UtilsExceptionMessageCommon.showMessageError(
                "Category does not exist!",
            );
        }

        const posterUrl = await this.firebaseService.uploadImageToFirebase(
            files["poster"][0],
        );
        const thumbnailUrl = await this.firebaseService.uploadImageToFirebase(
            files["thumbnail"][0],
        );

        const movie = await this.movieService.create({
            ...movieDto,
            genres: genreDto,
            poster: posterUrl,
            thumbnail: thumbnailUrl,
        });

        if (!movie)
            UtilsExceptionMessageCommon.showMessageError(
                "Create a failed movie!",
            );

        this.notificationService.create({
            object_id: movie.id,
            title: "Phim đang chiếu - " + movie.name,
            description: `Đến NHCinema "book" ngay ${movie.name}. ${movie.title}`,
            type: 2, // type of notification 1: booking, 2: movie
            announcement_date: movie.release,
        });
        response.setData(movie);

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API update movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "poster", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
    )
    async update(
        @Param("id") id: string,
        @UploadedFiles() files: Record<string, any>,
        @Body() movieDto: MovieDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const genreDto = movieDto.genres.replace(/\s/g, "").split(",");

        if (!(await this.genreService.findByIds(genreDto))) {
            UtilsExceptionMessageCommon.showMessageError(
                "Category does not exist!",
            );
        }

        if (movieDto.duration && Number.isNaN(Number(movieDto.duration)))
            UtilsExceptionMessageCommon.showMessageError(
                "Duration must be number!",
            );

        if (files["poster"])
            Object.assign(movieDto, {
                poster: await this.firebaseService.uploadImageToFirebase(
                    files["poster"][0],
                ),
                ...movieDto,
            });

        if (files["thumbnail"])
            Object.assign(movieDto, {
                thumbnail: await this.firebaseService.uploadImageToFirebase(
                    files["thumbnail"][0],
                ),
                ...movieDto,
            });

        response.setData(
            await this.movieService.update(id, {
                ...movieDto,
                status: +movieDto.status,
                genres: genreDto,
            }),
        );

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API delete movie" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Body() ids: string[], @Res() res: Response) {
        if (ids.length === 0)
            UtilsExceptionMessageCommon.showMessageError(
                "Delete movie failed!",
            );

        const response: ResponseData = new ResponseData();
        const movies = await this.movieService.findByIds(ids);

        if (movies.length !== ids.length)
            UtilsExceptionMessageCommon.showMessageError(
                "Delete movie failed!",
            );

        const movie = movies.pop();

        if (movie.status === MovieStatus.NOW_SHOWING) {
            /** Get the list of showtimes to check if the movie is in that showtime  */
            const showtimes = await this.showtimeService.getFutureShowtime();

            const movieShowtimes = showtimes.flatMap(
                (showtime) => showtime.movie_id,
            );

            const exist = ids.filter((id) => movieShowtimes.includes(id));

            if (exist.length !== 0)
                UtilsExceptionMessageCommon.showMessageError(
                    `${movies
                        .filter((movie) => exist.includes(movie.id))
                        .map(
                            (movie) => movie.name,
                        )} Cannot delete because this movie is already scheduled`,
                );
        }

        const status =
            movie.status === MovieStatus.STOP_SHOWING
                ? MovieStatus.NOW_SHOWING
                : MovieStatus.STOP_SHOWING;

        response.setData(
            (await this.movieService.updateMany(
                { _id: { $in: ids } },
                { $set: { status: status } },
            ))
                ? { msg: "Update successful." }
                : { msg: "Update failed." },
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/most-view")
    @ApiOperation({ summary: "API to retrieve the most sold movies" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getMovieByShowtime(@Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const movieIds = await this.showtimeService.findLatestUniqueMovies();

        const soldedMovies = await this.movieService.findByIds(movieIds);

        const presentMovies =
            await this.movieService.findDocumentsExceptIds(movieIds);

        const movies: Movie[] = [...soldedMovies, ...presentMovies];

        const genres = await this.genreService.findAll();

        const genreMap = {};
        genres.forEach((genre) => {
            genreMap[genre.id] = genre.name;
        });

        const mapGenreName = (genreId) => {
            return genreMap[genreId] || "";
        };

        // Map genre names for each data item
        const mappedData = movies.map((item) => {
            item.genres = item.genres.map(mapGenreName);

            return {
                ...item.toJSON(),
                release: UtilsDate.formatDateVNToString(new Date(item.release)),
            };
        });

        response.setData(mappedData);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get movie by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param("id") id: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const movie = await this.movieService.find(id);

        if (!movie || movie.status === MovieStatus.STOP_SHOWING) {
            UtilsExceptionMessageCommon.showMessageError(
                "Movie does not exist!",
            );
        }

        const result = new MovieResponse(movie);
        const genres = await this.genreService.findByIds(movie.genres);

        result.genres = genres.map((genre) => genre.name).join(", ");

        response.setData(result);
        return res.status(HttpStatus.OK).send(response);
    }
}
