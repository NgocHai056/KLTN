import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import * as querystring from 'qs';
import * as crypto from 'crypto';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { Role, Roles } from 'src/utils.common/utils.enum/role.enum';
import { PaymentDto } from './payment.dto/payment.dto';

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/payment' })
export class PaymentController {

    @Post('create-payment-url')
    @Roles(Role.User)
    async createPaymentUrl(
        @Body() paymentDto: PaymentDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        const tmnCode = process.env.vnp_TmnCode;
        const secretKey = process.env.vnp_HashSecret;
        const vnpUrl = process.env.vnp_Url;
        const returnUrl = process.env.vnp_ReturnUrl;
        const orderId = moment(date).format('DDHHmmss');
        const amount = paymentDto.amount;
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
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        const sortedParams = this.sortObject(vnp_Params);

        const querystring = require('qs');
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        const finalUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;

        res.redirect(finalUrl);
    }

    private sortObject(obj: Record<string, any>): Record<string, any> {
        const sorted: Record<string, any> = {};
        const str: string[] = [];
        let key: any;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }
}
