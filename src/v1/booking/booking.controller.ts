import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    ParseIntPipe,
    Res,
    UsePipes,
    ValidationPipe,
    Post,
    Body
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BookingService } from "./booking.service";
import { StoreProcedureOutputResultInterface } from "src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common";
import { Booking } from "./booking.entity/booking.entity";
import { BookingDto } from "./booking.dto/booking.dto";
import { RoomService } from "../room/room.service";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";
import { TicketPriceService } from "../ticket-price/ticket-price.service";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { BookingResponse } from "./booking.response/booking.response";

@Controller({ version: VersionEnum.V1.toString(), path: 'booking' })
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly roomService: RoomService,
        private readonly ticketPriceService: TicketPriceService,
    ) { }

    @Post("")
    @Roles(Role.User)
    @ApiOperation({ summary: "API booking vé theo suất chiếu" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() bookingDto: BookingDto,
        @Res() res: Response,
        @GetUser() user: UserModel
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let roomIds = (await this.roomService.findBy({ theater_id: bookingDto.theater_id }))
            .map(room => { return room.id });

        let bookings: StoreProcedureOutputResultInterface<Booking, any> = await this.bookingService.callStoredProcedure(
            "CALL sp_u_create_booking(?,?,?,?,?,?,?,?,?,?,@status,@message);"
            + "SELECT @status AS status_code, @message AS message_error",
            [`[${String(roomIds)}]`, user.id, bookingDto.movie_id, bookingDto.seat_id, bookingDto.seat_number, bookingDto.time, bookingDto.showtime, bookingDto.payment_method, 1, (await this.ticketPriceService.findBy({ type: 1 })).pop().price]);

        response.setData(bookings.list);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get booking by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(new BookingResponse(await this.bookingService.findOne(id)));
        return res.status(HttpStatus.OK).send(response);
    }
}
