import {
    Controller,
    Get,
    HttpStatus,
    Query,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { ApiOperation } from '@nestjs/swagger';
import { Response } from "express";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BookingService } from "../booking/booking.service";
import { UserModel } from "../user/user.entity/user.model";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { BookingStatisticDto } from "./statistic.dto/booking-statistic.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/statistical" })
export class StatisticalController {

    constructor(
        private readonly bookingService: BookingService
    ) { }

    @Get("/revenue")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API doanh thu." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getRevenue(
        @Query() revenueDto: BookingStatisticDto,
        @Res() res: Response,
    ) {
        let response: ResponseData = new ResponseData();

        if (+revenueDto.report_type === 1)
            response.setData(await this.bookingService.calculateRevenueByHourInDay(revenueDto));
        if (+revenueDto.report_type === 2)
            response.setData(await this.bookingService.calculateRevenueByDayInMonth(revenueDto, new Date(revenueDto.time)));
        if (+revenueDto.report_type === 3)
            response.setData(await this.bookingService.calculateRevenueByMonthInYear(revenueDto, new Date(revenueDto.time).getFullYear()));

        return res.status(HttpStatus.OK).send(response);
    }
}
