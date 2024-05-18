import {
    Controller,
    Get,
    HttpStatus,
    Query,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BookingService } from "../booking/booking.service";
import { MovieService } from "../movie/movie.service";
import { UserModel } from "../user/user.entity/user.model";
import { UserService } from "../user/user.service";
import { BookingStatisticDto } from "./statistic.dto/booking-statistic.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/statistical" })
export class StatisticalController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly movieService: MovieService,
        private readonly userService: UserService,
    ) {}

    @Get("/revenue")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API doanh thu." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getRevenue(
        @Query() revenueDto: BookingStatisticDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        if (+revenueDto.report_type === 1)
            response.setData(
                await this.bookingService.calculateRevenueByHourInDay(
                    revenueDto,
                ),
            );
        if (+revenueDto.report_type === 2)
            response.setData(
                await this.bookingService.calculateRevenueByDayInMonth(
                    revenueDto,
                    new Date(revenueDto.time),
                ),
            );
        if (+revenueDto.report_type === 3)
            response.setData(
                await this.bookingService.calculateRevenueByMonthInYear(
                    revenueDto,
                    new Date(revenueDto.time).getFullYear(),
                ),
            );

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/overview")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API doanh thu." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getOverallStatistics(
        @Query("report_type") reportType: number = 0,
        @Res() res: Response,
        @GetUser() user: UserModel,
    ) {
        const response: ResponseData = new ResponseData();

        const booking = await this.bookingService.getOverallStatistics(
            user.theater_id,
            +reportType,
        );

        const statisticByMovie = await this.bookingService.getStatisticByMovie(
            user.theater_id,
            reportType,
        );

        const movies = await this.movieService.findAll();

        const users = await this.userService.findByCondition({
            role: Role.USER,
        });

        let result = {};

        if (user.role === Role.ADMIN)
            result = {
                user_count: users.length,
            };

        response.setData({
            total_revenue: booking.length > 0 ? booking[0].total_revenue : 0,
            upcoming_movie: movies.filter((movie) => movie.release > new Date())
                .length,
            showing_movie: movies.filter((movie) => movie.release <= new Date())
                .length,
            ...result,
            movie_statistic: statisticByMovie,
        });

        return res.status(HttpStatus.OK).send(response);
    }
}
