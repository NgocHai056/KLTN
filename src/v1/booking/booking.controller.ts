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
import { UsePointBookingDto } from "./booking.dto/use-point.booking.dto";
import { MemberService } from "../member/member.service";
import { GetBookingDto } from "./booking.dto/get-booking.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/booking" })
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly showtimeService: ShowtimeService,
        private readonly seatService: SeatService,
        private readonly roomService: RoomService,
        private readonly movieService: MovieService,
        private readonly memberService: MemberService,
    ) {}

    @Post("")
    @Roles(Role.USER)
    @ApiOperation({ summary: "API booking vé theo suất chiếu" })
    async create(
        @Body() bookingDto: BookingDto,
        @Res() res: Response,
        @GetUser() user: UserModel,
    ) {
        const response: ResponseData = new ResponseData();

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

    @Post("/use-point")
    @ApiOperation({ summary: "API update price when used point to exchange" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async useExchangePoint(
        @Body() bookingDto: UsePointBookingDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const booking = await this.bookingService.find(bookingDto.booking_id);

        if (!booking || !booking.expireAt)
            UtilsExceptionMessageCommon.showMessageError(
                "Booking doesn't exits!",
            );

        if (!(await this.bookingService.usePoint(booking, bookingDto)))
            UtilsExceptionMessageCommon.showMessageError(
                "Point exchange failed",
            );

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/user")
    @ApiOperation({ summary: "API get booking by user_id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAllByUserId(@Param("id") userId: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

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

        bookings.sort(
            (a, b) => b.created_at.getTime() - a.created_at.getTime(),
        );

        const member = await this.memberService.findByCondition({
            user_id: userId,
        });

        response.setData(bookings);
        return res.status(HttpStatus.OK).send({
            ...response,
            exchange_point: member.length > 0 ? member[0].consumption_point : 0,
        });
    }

    @Get()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API hiển thị list vé của người dùng." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(
        @Query() pagination: PaginationAndSearchDto,
        @Query() bookintDto: GetBookingDto,
        @Res() res: Response,
        @GetUser() user: UserModel,
    ) {
        const response: ResponseData = new ResponseData();

        const query: any = {};

        if (bookintDto.movie_id) query.movie_id = bookintDto.movie_id;

        if (bookintDto.time) query.time = bookintDto.time;

        if (pagination.key_search !== "")
            query.$or = [
                { code: { $regex: new RegExp(pagination.key_search, "i") } },
                {
                    movie_name: {
                        $regex: new RegExp(pagination.key_search, "i"),
                    },
                },
                {
                    user_name: {
                        $regex: new RegExp(pagination.key_search, "i"),
                    },
                },
            ];

        if (user.role === Role.MANAGER) query.theater_id = user.theater_id;

        const bookings = await this.bookingService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
            [{ $match: query }, { $sort: { created_at: -1 } }],
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
        const response: ResponseData = new ResponseData();

        const booking = await this.bookingService.find(id);

        if (!booking)
            UtilsExceptionMessageCommon.showMessageError("Booking not found!");

        const movie = await this.movieService.find(booking.movie_id);

        booking.time = UtilsDate.formatDateVNToString(new Date(booking.time));

        const member = await this.memberService.findByCondition({
            user_id: booking.user_id,
        });

        response.setData({
            ...booking.toObject(),
            movie_age: movie.age,
            movie_poster: movie.poster,
            exchange_point: member.length > 0 ? member[0].consumption_point : 0,
        });
        return res.status(HttpStatus.OK).send(response);
    }
}
