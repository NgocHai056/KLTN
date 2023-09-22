import {
    Controller,
    Get,
    HttpStatus,
    Res,
    UsePipes,
    ValidationPipe,
    Post,
    Body,
    Query
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { StoreProcedureOutputResultInterface } from "src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common";

import { ShowtimeService } from './showtime.service';
import { Showtime } from "./showtime.entity/showtime.entity";
import { ShowtimeDto } from "./showtime.dto/showtime.dto";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { GetTimeDto } from "./showtime.dto/get-time.dto";

@Controller({ version: VersionEnum.V1.toString(), path: 'showtime' })
export class ShowtimeController {
    constructor(
        private readonly showtimeService: ShowtimeService
    ) { }

    @Post("")
    @Roles(Role.Admin)
    @ApiOperation({ summary: "API tạo suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() showtimeDto: ShowtimeDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let showtimes: StoreProcedureOutputResultInterface<Showtime, any> = await this.showtimeService.callStoredProcedure(
            "CALL sp_u_create_showtime(?,?,?,?,?,@status,@message);"
            + "SELECT @status AS status_code, @message AS message_error",
            [showtimeDto.theater_id, showtimeDto.room_id, showtimeDto.movie_id, showtimeDto.time, showtimeDto.showtime]);

        response.setData(showtimes.list);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('/times')
    async getTimesByMovieId(
        @Query() getTimeDto: GetTimeDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.showtimeService.getTimesByMovieId(+getTimeDto.theater_id, +getTimeDto.movie_id));
        return res.status(HttpStatus.OK).send(response);
    }
}
