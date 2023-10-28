import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'qs';

@Injectable()
export class PaymentService {

    async handleVnpayIPN(vnpParams) {
        const secureHash = vnpParams.vnp_SecureHash;

        delete vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHashType;

        vnpParams = this.sortObject(vnpParams);

        const signed = this.signature(vnpParams);

        if (secureHash === signed) {
            const bookingId = vnpParams.vnp_TxnRef;
            const rspCode = vnpParams.vnp_ResponseCode;

            return { booking_id: bookingId, status_code: rspCode }
        }

        return;
    }

    signature(vnpParams): string {
        const secretKey = process.env.vnp_HashSecret;
        const signData = querystring.stringify(vnpParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        return hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    }

    sortObject(obj: Record<string, any>): Record<string, any> {
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
