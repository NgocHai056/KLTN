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
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { MovieService } from "../movie/movie.service";
import { RoomService } from "../room/room.service";
import { SeatService } from "../seat/seat.service";
import { ShowtimeService } from "../showtime/showtime.service";
import { UserModel } from "../user/user.entity/user.model";
import { BookingDto } from "./booking.dto/booking.dto";
import { BookingService } from "./booking.service";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/booking" })
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly showtimeService: ShowtimeService,
        private readonly seatService: SeatService,
        private readonly roomService: RoomService,
        private readonly movieService: MovieService,
    ) {}

    @Post("")
    @Roles(Role.USER)
    @ApiOperation({ summary: "API booking vé theo suất chiếu" })
    async create(
        @Body() bookingDto: BookingDto,
        @Res() res: Response,
        @GetUser() user: UserModel,
    ) {
        let response: ResponseData = new ResponseData();

        const room = await this.roomService.find(bookingDto.room_id);

        if (!room)
            UtilsExceptionMessageCommon.showMessageError("Room doesn't exist!");

        if (
            bookingDto.seats.filter(
                (seat) => room.seat_capacity < parseInt(seat.seat_number, 10),
            ).length !== 0
        )
            UtilsExceptionMessageCommon.showMessageError(
                "Seat number is out of range!",
            );

        const showtime = await this.showtimeService.checkExistShowtime(
            [bookingDto.room_id],
            bookingDto.movie_id,
            bookingDto.time,
            bookingDto.showtime,
        );

        const movie = await this.movieService.find(bookingDto.movie_id);

        if (!movie)
            UtilsExceptionMessageCommon.showMessageError(
                "Movie doesn't exist!",
            );

        const seatNumbers: string[] = bookingDto.seats
            .map((seat) => seat.seat_number)
            .flat();

        /** Check empty seat */
        await this.seatService.checkEmptySeat(
            bookingDto.room_id,
            bookingDto.movie_id,
            seatNumbers,
            bookingDto.time,
            bookingDto.showtime,
        );

        if (
            (
                await this.bookingService.findByCondition({
                    user_id: user.id,
                    movie_id: bookingDto.movie_id,
                    room_number: room.room_number,
                    seat_number: { $in: seatNumbers },
                    time: bookingDto.time,
                    showtime: bookingDto.showtime,
                })
            ).length !== 0
        ) {
            UtilsExceptionMessageCommon.showMessageError(
                "You cannot book the same chair!",
            );
        }

        response.setData(
            await this.bookingService.createBooking(
                bookingDto,
                user,
                room.theater_id,
                showtime[0].room_id,
                room.room_number,
                movie,
            ),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/user")
    @ApiOperation({ summary: "API get booking by user_id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAllByUserId(@Param("id") userId: string, @Res() res: Response) {
        let response: ResponseData = new ResponseData();

        const bookings = await this.bookingService.findByCondition({
            user_id: userId,
        });

        if (bookings.length === 0)
            UtilsExceptionMessageCommon.showMessageError(
                "The user don't have any booking yet!",
            );

        bookings.forEach((booking) => {
            booking.time = UtilsDate.formatDateVNToString(
                new Date(booking.time),
            );
        });

        response.setData(bookings);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API hiển thị list vé của người dùng." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
        @GetUser() user: UserModel,
    ) {
        let response: ResponseData = new ResponseData();

        const bookings = await this.bookingService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
        );

        if (user.role === Role.MANAGER)
            bookings.data.filter(
                (booking) => booking.theater_id === user.theater_id,
            );

        bookings.data.forEach(
            (booking) =>
                (booking.time = UtilsDate.formatDateVNToString(
                    new Date(booking.time),
                )),
        );

        response.setData(bookings.data);
        response.setTotalRecord(bookings.total_record);

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get booking by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param("id") id: string, @Res() res: Response) {
        let response: ResponseData = new ResponseData();

        const booking = await this.bookingService.find(id);

        if (!booking)
            UtilsExceptionMessageCommon.showMessageError("Booking not found!");

        booking.time = UtilsDate.formatDateVNToString(new Date(booking.time));

        response.setData(booking);
        return res.status(HttpStatus.OK).send(response);
    }
}
