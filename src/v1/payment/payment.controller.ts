import { Body, Controller, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import * as querystring from 'qs';
import { Role, Roles } from 'src/utils.common/utils.enum/role.enum';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { BookingService } from '../booking/booking.service';
import { PaymentDto } from './payment.dto/payment.dto';
import { PaymentService } from './payment.service';
import { MailService } from 'src/mail/mail.service';
import { GetUser } from 'src/utils.common/utils.decorator.common/utils.decorator.common';
import { UserModel } from '../user/user.entity/user.model';

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/payment' })
export class PaymentController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly paymentService: PaymentService,
        private readonly mailService: MailService
    ) { }

    @Post('create-payment-url')
    @Roles(Role.User)
    async createPaymentUrl(
        @Body() paymentDto: PaymentDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const booking = await this.bookingService.find(paymentDto.booking_id);

        if (!booking)
            UtilsExceptionMessageCommon.showMessageError("Payment failed!");

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        const tmnCode = process.env.vnp_TmnCode;
        const vnpUrl = process.env.vnp_Url;
        const returnUrl = process.env.vnp_ReturnUrl;
        const amount = booking.total_amount;
        const bankCode = paymentDto.bank_code;

        let locale = paymentDto.language;
        if (locale === null || locale === '' || !locale) {
            locale = 'vn';
        }
        const currCode = 'VND';
        const vnp_Params: Record<string, any> = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = booking.id;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + booking.id;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        const sortedParams = this.paymentService.sortObject(vnp_Params);

        const signed = this.paymentService.signature(sortedParams);
        vnp_Params['vnp_SecureHash'] = signed;
        const finalUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;

        res.redirect(finalUrl);
    }

    @Post("/booking-confirm")
    @Roles(Role.User)
    async handleVnpayIPN(
        @GetUser() user: UserModel,
        @Query() vnpParams, @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        /** Handle information of booking */
        const data = await this.paymentService.handleVnpayIPN(vnpParams);

        if (!data)
            UtilsExceptionMessageCommon.showMessageError("Payment confirmation failed!");

        const booking = await this.bookingService.find(data.booking_id);

        if (!booking)
            UtilsExceptionMessageCommon.showMessageError("Payment confirmation failed!");

        this.mailService.sendConfirmation(
            user.email,
            "Thank you for booking with NHCinema!",
            './booking-confirm',
            {
                movieName: booking.movie_name, date: booking.time,
                time: booking.showtime, seats: booking.seats.map(seat => seat.seat_number).join(', ')
            });

        response.setData(await this.bookingService.confirm(booking));
        return res.status(HttpStatus.OK).send(response);
    }
}
