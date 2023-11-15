import {
    Controller,
    Get,
    HttpStatus,
    Res,
    UsePipes,
    ValidationPipe,
    Post,
    Body,
    Query,
    Param
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";

import { ShowtimeService } from './showtime.service';
import { ShowtimeDto } from "./showtime.dto/showtime.dto";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { GetShowtimeDto } from "./showtime.dto/get-time.dto";
import { FacadeService } from "src/v1/facade-theater/facade.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ShowtimeResponse } from "./showtime.response/showtime.response";
import { GetShowtimeByMovieDto } from "./showtime.dto/get-time-by-movie.dto";
import { CopyShowtimeDto } from "./showtime.dto/copy-showtime.dto";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/showtime' })
export class ShowtimeController {
    constructor(
        private readonly showtimeService: ShowtimeService,
        private readonly facadeService: FacadeService
    ) { }

    @Post("")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API tạo suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() showtimeDto: ShowtimeDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        /** Check if theater, room and movie have exist */
        await this.facadeService.checkTheaterRoomAndMovieExistence(
            showtimeDto.theater_id, showtimeDto.room_id, showtimeDto.movie_id);

        response.setData(await this.showtimeService.createShowtime(
            showtimeDto.room_id, showtimeDto.movie_id, showtimeDto.time, showtimeDto.showtime));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post('/copy-showtime')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API sao chép lịch chiếu của toàn bộ ngày cụ thể {time} truyền vào!" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async copyShowtimes(
        @Body() showtimeDto: CopyShowtimeDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.showtimeService.copyShowtime(
            /** Lấy danh sách room theo theater_id */
            (await this.facadeService.getRoomsByTheaterId(showtimeDto.theater_id)).map(room => room.id),
            showtimeDto.time, showtimeDto.target_time)
        );

        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API lấy danh sách tất cả lịch chiếu theo rạp chiếu phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Query() showtimeDto: GetShowtimeDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.showtimeService
            .findAllByTheater(
                /** Lấy danh sách room theo theater_id */
                (await this.facadeService.getRoomsByTheaterId(showtimeDto.theater_id)).map(room => room.id),
                showtimeDto.movie_id, showtimeDto.time)
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('/times')
    @ApiOperation({ summary: "API xem lịch chiếu theo ngày" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getTimes(
        @Query() showtimeDto: GetShowtimeDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.showtimeService
            .getShowTimes(
                /** Lấy danh sách room theo theater_id */
                (await this.facadeService.getRoomsByTheaterId(showtimeDto.theater_id)).map(room => room.id),
                showtimeDto.time)
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('/time-by-movie')
    @ApiOperation({ summary: "API xem lịch chiếu theo phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getTimesByMovieId(
        @Query() showtimeDto: GetShowtimeByMovieDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.showtimeService
            .getShowTimeByMovie(
                /** Lấy danh sách room theo theater_id */
                (await this.facadeService.getRoomsByTheaterId(showtimeDto.theater_id)).map(room => room.id),
                showtimeDto.movie_id)
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/seats")
    @ApiOperation({ summary: "API get showtime by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const showtime = await this.showtimeService.find(id);

        if (!showtime)
            return res.status(HttpStatus.OK).send(response);

        const data = await this.showtimeService.checkSeatStatus(showtime.id);

        let showtimeResponse = new ShowtimeResponse(data);
        showtimeResponse.room_number = (await this.facadeService.getRoom(showtimeResponse.room_id)).room_number;
        showtimeResponse.mapArraySeat(data.seat_array);

        response.setData(showtimeResponse);
        return res.status(HttpStatus.OK).send(response);
    }
}
