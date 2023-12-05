import { Injectable } from '@nestjs/common';
import { User } from './user.entity/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseService from 'src/base.service/base.service';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { UpdatePasswordDto } from './user.dto/user-update-password.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto/user.dto';
import { UserStatus } from 'src/utils.common/utils.enum/user-status.enum';
import { Role } from 'src/utils.common/utils.enum/role.enum';
import { PaginationAndSearchDto } from 'src/utils.common/utils.pagination/pagination-and-search.dto';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(@InjectModel(User.name) private readonly userRepository: Model<User>) {
        super(userRepository);
    }

    async createUser(userDto: UserDto) {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        await this.checkExisting(userDto.email, userDto.phone);

        /** Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu */
        const hashedPassword: string = await bcrypt.hash(userDto.password, await bcrypt.genSalt());

        userDto.password = hashedPassword;
        return await this.create({ ...userDto, status: UserStatus.ACTIVATED });
    }

    async getAll(pagination: PaginationAndSearchDto, role?: number) {
        const query: any = {};

        if (role !== -1)
            query.$and =
                [{
                    role: {
                        $ne: Role.ADMIN
                    }
                }, {
                    role: role
                }]
        else
            query.role = {
                $ne: Role.ADMIN
            }


        const keySearch = pagination.key_search;
        if (keySearch !== '') {
            query.$or = [
                { name: { $regex: new RegExp(keySearch, 'i') } },
                { email: { $regex: new RegExp(keySearch, 'i') } },
                { phone: { $regex: new RegExp(keySearch, 'i') } },
                { gender: { $regex: new RegExp(keySearch, 'i') } }
            ];

        };

        const aggregationPipeline = [
            { $match: query },
            {
                $addFields: {
                    theater_id: { $toObjectId: '$theater_id' } // Chuyển đổi movie_id từ chuỗi sang ObjectId
                }
            },
            {
                $lookup: {
                    from: 'theaters', // Tên của collection theaters
                    localField: 'theater_id',
                    foreignField: '_id',
                    as: 'theaterInfo'
                }
            },
            { $sort: { "role": 1 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    role: 1,
                    date_of_birth: 1,
                    gender: 1,
                    status: 1,
                    created_at: 1,
                    updated_at: 1,
                    __v: 1,
                    theater_name: { $arrayElemAt: ['$theaterInfo.name', 0] }, // Lấy name từ theaterInfo
                }
            }
        ];

        return await this.findAllForPagination(+pagination.page, +pagination.page_size, aggregationPipeline);
    }

    async updatePassword(userId: string, password: string): Promise<User> {

        /** Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu */
        const hashedPassword: string = await bcrypt.hash(password, await bcrypt.genSalt());

        return await this.update(userId, { password: hashedPassword })
    }

    async findByEmail(email: string) {
        /** 'i' để tìm kiếm không phân biệt chữ hoa chữ thường */
        return await this.findByCondition({ email: { $regex: new RegExp(email, 'i') } });
    }

    async checkExisting(email: string, phone: string) {
        /** 'i' để tìm kiếm không phân biệt chữ hoa chữ thường */
        const user = await this.userRepository.find(
            {
                $or: [
                    { email: { $regex: new RegExp('^' + email + '$', 'i') } },
                    { phone: phone }
                ]
            }
        ).exec();

        if (user.length !== 0 && user[0].email === email)
            UtilsExceptionMessageCommon.showMessageError("This account has already existed.");

        if (user.length !== 0 && user[0].phone === phone)
            UtilsExceptionMessageCommon.showMessageError("This phone number has already existed.");

        return user;
    }
}
