import {
    Controller,
    Get,
    HttpStatus,
    Param,
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
import { BookingDto } from "./booking.dto/booking.dto";
import { RoomService } from "../room/room.service";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { BookingResponse } from "./booking.response/booking.response";
import { SeatService } from "../seat/seat.service";
import { ShowtimeService } from "../showtime/showtime.service";
import { BookingConfirmDto } from "./booking.dto/booking-confirm.dto";
import { PaymentStatus } from "src/utils.common/utils.enum/payment-status.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { MovieService } from "../movie/movie.service";

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/booking' })
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly showtimeService: ShowtimeService,
        private readonly seatService: SeatService,
        private readonly roomService: RoomService,
        private readonly movieService: MovieService,
    ) { }

    @Post("")
    @Roles(Role.User)
    @ApiOperation({ summary: "API booking vé theo suất chiếu" })
    async create(
        @Body() bookingDto: BookingDto,
        @Res() res: Response,
        @GetUser() user: UserModel
    ) {
        let response: ResponseData = new ResponseData();

        const room = await this.roomService.find(bookingDto.room_id);

        if (!room)
            UtilsExceptionMessageCommon.showMessageError("Room doesn't exist!");

        if (bookingDto.seats.filter(seat => room.seat_capacity < parseInt(seat.seat_number, 10)).length !== 0)
            UtilsExceptionMessageCommon.showMessageError("Seat number is out of range!");

        const showtime = await this.showtimeService.checkExistShowtime([bookingDto.room_id], bookingDto.movie_id, bookingDto.time, bookingDto.showtime);

        const movie = await this.movieService.find(bookingDto.movie_id);

        if (!movie)
            UtilsExceptionMessageCommon.showMessageError("Movie doesn't exist!");

        const seatNumbers: string[] = bookingDto.seats.map(seat => seat.seat_number).flat();

        /** Check empty seat */
        await this.seatService.checkEmptySeat(bookingDto.room_id, bookingDto.movie_id, seatNumbers, bookingDto.time, bookingDto.showtime);


        if ((await this.bookingService.findByCondition(
            {
                user_id: user.id, movie_id: bookingDto.movie_id,
                room_number: room.room_number, seat_number: { $in: seatNumbers },
                time: bookingDto.time, showtime: bookingDto.showtime
            })).length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("You cannot book the same chair!");
        }

        response.setData(await this.bookingService.createBooking(bookingDto, user.id, user.name, showtime[0].room_id, room.room_number, movie));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/confirm")
    @ApiOperation({ summary: "API xác nhận thanh toán." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async confirm(
        @Body() bookingConfirmDto: BookingConfirmDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const booking = await this.bookingService.find(bookingConfirmDto.booking_id);

        if (!booking) {
            UtilsExceptionMessageCommon.showMessageError("Ticket completion failed!");
        }

        if (booking.payment_status === PaymentStatus.PAID) {
            UtilsExceptionMessageCommon.showMessageError("Tickets have been completed!");
        }

        /** Update status of seats and status of booking */
        await this.seatService.updateManySeat(booking.room_id, booking.movie_id, booking.time, booking.showtime, booking.seats.map(seat => seat.seat_number).flat());

        response.setData(new BookingResponse(
            await this.bookingService.update(
                bookingConfirmDto.booking_id,
                {
                    payment_status: PaymentStatus.PAID,
                    $unset: { expireAt: 1 }
                }
            ))
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get booking by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.bookingService.find(id));
        return res.status(HttpStatus.OK).send(response);
    }
}
