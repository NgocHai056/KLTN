import { Injectable } from '@nestjs/common';
import { User } from './user.entity/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseService from 'src/base.service/base.service';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(@InjectModel(User.name) private readonly userRepository: Model<User>) {
        super(userRepository);
    }

    async checkExisting(email: string) {
        /** 'i' để tìm kiếm không phân biệt chữ hoa chữ thường */
        const user = await this.userRepository.find({ email: { $regex: new RegExp(email, 'i') } }).exec();

        if (user.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("This account has already existed.");
        }

        return user;
    }

    async checkExistPhone(phone: string) {
        const user = await this.userRepository.find({ phone: phone }).exec();

        if (user.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("This phone number has already existed.");
        }

        return user;
    }
}
