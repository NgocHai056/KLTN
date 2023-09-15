import {
    Controller,
    Get,
    Post,
    Body,
    HttpStatus,
    Param,
    Query,
    ParseIntPipe,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOkResponse, getSchemaPath, ApiOperation } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/utils.common/utils.swagger.common/utils.swagger.response';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { Seat } from "./seat.entity/seat.entity";
import { SeatService } from "./seat.service";
import { SeatShowtime } from "./seat.entity/seat.showtime.entity";
import { ShowtimeDto } from "./seat.dto/showtime.dto";
import { StoreProcedureOutputResultInterface } from "src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common";
import { SeatResponse } from "./seat.response/seat.response";

@Controller({ version: VersionEnum.V1.toString(), path: 'seat' })
export class SeatController {
    constructor(private seatService: SeatService) { }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                ShowtimeDto
                            ),
                        },
                    },
                },
            ],
        },
    })
    @Get("/showtime")
    @ApiOperation({ summary: "API lấy danh sách ghế theo suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async showtime(
        @Query() showtimeDto: ShowtimeDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let seats: StoreProcedureOutputResultInterface<Seat, any> = await this.seatService.callStoredProcedure(
            "CALL sp_get_list_of_the_seat_status_base_on_showtime(?,?,@status,@message);"
            + "SELECT @status AS status_code, @message AS message_error",
            [showtimeDto.showtime, showtimeDto.time]);

        response.setData(new SeatResponse().mapToList(seats.list));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get seat by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let seat: Seat = await this.seatService.findOne(id);
        const seatArray = JSON.parse(seat.showtimes);
        const seatShowTimes: SeatShowtime[] = [];

        for (const seatData of seatArray) {
            const seatShowtime = new SeatShowtime();
            seatShowtime.status = seatData.status;
            seatShowtime.time = new Date(seatData.time);

            seatShowTimes.push(seatShowtime);
        }


        response.setData(seatShowTimes);
        return res.status(HttpStatus.OK).send(response);
    }
}
