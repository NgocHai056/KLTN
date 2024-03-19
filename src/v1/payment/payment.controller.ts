import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as moment from "moment";
import * as querystring from "qs";
import { MailService } from "src/mail/mail.service";
import { PaymentStatus } from "src/utils.common/utils.enum/payment-status.enum";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { seatArray } from "src/utils.common/utils.enum/seat-array.const";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.format-time.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BookingService } from "../booking/booking.service";
import { PaymentDto } from "./payment.dto/payment.dto";
import { PaymentService } from "./payment.service";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/payment" })
export class PaymentController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly paymentService: PaymentService,
        private readonly mailService: MailService,
    ) {}

    @Post("create-payment-url")
    @Roles(Role.USER)
    async createPaymentUrl(
        @Body() paymentDto: PaymentDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        let response: ResponseData = new ResponseData();

        const booking = await this.bookingService.find(paymentDto.booking_id);

        if (!booking || booking.payment_status === PaymentStatus.PAID)
            UtilsExceptionMessageCommon.showMessageError("Payment failed!");

        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");

        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        const tmnCode = process.env.vnp_TmnCode;
        const vnpUrl = process.env.vnp_Url;
        const returnUrl = process.env.vnp_ReturnUrl;
        const amount = booking.total_amount;

        let locale = paymentDto.language;
        if (locale === null || locale === "" || !locale) {
            locale = "vn";
        }
        const currCode = "VND";
        const vnp_Params: Record<string, any> = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = booking.id;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + booking.id;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;

        const sortedParams = this.paymentService.sortObject(vnp_Params);

        const signed = this.paymentService.signature(sortedParams);
        vnp_Params["vnp_SecureHash"] = signed;
        const finalUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, {
            encode: false,
        })}`;

        response.setData(finalUrl);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/booking-confirm")
    @Roles(Role.USER)
    async handleVnpayIPN(@Query() vnpParams, @Res() res: Response) {
        let response: ResponseData = new ResponseData();

        /** Handle information of booking */
        const data = await this.paymentService.handleVnpayIPN(vnpParams);

        if (!data)
            UtilsExceptionMessageCommon.showMessageError(
                "Payment confirmation failed!",
            );

        const booking = await this.bookingService.find(data.booking_id);

        if (!booking)
            UtilsExceptionMessageCommon.showMessageError(
                "Payment confirmation failed!",
            );

        response.setData(await this.bookingService.confirm(booking));

        booking.time = UtilsDate.formatDateVNToString(new Date(booking.time));

        this.mailService.sendConfirmation(
            booking.email,
            "Thank you for booking with NHCinema!",
            "./booking-confirm",
            {
                movieName: booking.movie_name,
                date: booking.time,
                time: booking.showtime,
                seats: booking.seats
                    .map((seat) => seatArray[parseInt(seat.seat_number) - 1])
                    .join(", "),
            },
        );

        return res.status(HttpStatus.OK).send(response);
    }
}
