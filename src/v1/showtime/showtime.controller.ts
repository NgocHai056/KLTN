import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { ApiOperation } from '@nestjs/swagger';
import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";

import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { FacadeService } from "src/v1/facade-theater/facade.service";
import { CopyShowtimeDto } from "./showtime.dto/copy-showtime.dto";
import { GetShowtimeByMovieDto } from "./showtime.dto/get-time-by-movie.dto";
import { GetShowtimeDto } from "./showtime.dto/get-time.dto";
import { ShowtimeUpdateDto } from "./showtime.dto/showtime-update.dto";
import { ShowtimeDto } from "./showtime.dto/showtime.dto";
import { ShowtimeResponse } from "./showtime.response/showtime.response";
import { ShowtimeService } from './showtime.service';
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";

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


    @Post("/:id/update")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API cập nhật suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() showtimeDto: ShowtimeUpdateDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const showtime = await this.showtimeService.find(id);

        if (!showtime)
            UtilsExceptionMessageCommon.showMessageError("Showtime not exist.");

        /** Check if theater, room and movie have exist */
        await this.facadeService.checkRoomAndMovieExistence(
            showtimeDto.room_id, showtimeDto.movie_id);

        Object.assign(showtime, showtimeDto);

        const checkShowtime = await this.showtimeService
            .findByCondition({ room_id: showtime.room_id, movie_id: showtime.movie_id, time: showtime.time, showtime: showtime.showtime });

        if (checkShowtime)
            UtilsExceptionMessageCommon.showMessageError("Update showtime failed. Because showtimes overlapped.");

        response.setData(await this.showtimeService.update(id, showtime));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/delete")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API xóa suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const showtime = await this.showtimeService.find(id);

        if (!showtime)
            UtilsExceptionMessageCommon.showMessageError("Showtime not exist.");

        if (new Date(showtime.time) < new Date())
            UtilsExceptionMessageCommon.showMessageError("Cannot delete showtime with time smaller than current date.");

        response.setData(await this.showtimeService.delete(id));
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
