import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { OTP } from './otp.entity/otp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class OtpService extends BaseService<OTP> {
    constructor(@InjectModel(OTP.name) private readonly otpRepository: Model<OTP>) {
        super(otpRepository);
    }

    async checkExisting(email: string, otp: string) {
        /** 'i' để tìm kiếm không phân biệt chữ hoa chữ thường */
        await this.otpRepository.find({
            $and: [
                { email: { $regex: new RegExp(email, 'i') } },
                { code: { $regex: new RegExp(otp, 'i') } },
            ]
        }).exec();

        if (otp.length === 0) {
            UtilsExceptionMessageCommon.showMessageError("Invalid Code.");
        }
    }
}
