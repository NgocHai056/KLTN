import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtToken } from 'src/utils.common/utils.jwt-token.common/utils.jwt-token.common';
import { JwtTokenInterFace } from 'src/utils.common/utils.jwt-token.common/utils.jwt-token.interface.common';
import { UserDto } from 'src/v1/user/user.dto/user.dto';
import { User } from 'src/v1/user/user.entity/user.entity';
import { UserService } from 'src/v1/user/user.service';
import { LoginDto } from './auth.dto/login.dto';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { MailService } from 'src/mail/mail.service';
import { UserResponse } from 'src/v1/user/user.response/user.response';
import { OtpService } from 'src/otp/otp.service';
import { UserStatus } from 'src/utils.common/utils.enum/user-status.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        private mailService: MailService
    ) { }

    async signUp(user: UserDto): Promise<User> {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        await this.userService.checkExisting(user.email);

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        /** Send code to email for confirmation */
        await this.mailService.sendUserConfirmation(user, 'Welcome to NHCinema! Please validate you address…', './confirmation', { name: user.name, code });

        await this.otpService.create({ code, email: user.email, expireAt: new Date(Date.now() + 5 * 60 * 1000) });

        /** Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu */
        const hashedPassword: string = await bcrypt.hash(user.password, await bcrypt.genSalt());

        return await this.userService.create(
            {
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: hashedPassword,
                status: UserStatus.NOT_ACTIVATED,
                expireAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        );
    }

    async verifyAccount(userId: string, otp: string): Promise<User> {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        const user = await this.userService.find(userId);

        await this.otpService.checkExisting(user.email, otp);

        return await this.userService.update(
            userId,
            {
                status: UserStatus.ACTIVATED,
                $unset: { expireAt: 1 }
            }
        );
    }

    async login(loginDto: LoginDto): Promise<any> {

        const users: any[] = await this.userService.findByCondition({ email: { $regex: new RegExp(loginDto.email, 'i') } });

        const user: User = users.pop();

        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            UtilsExceptionMessageCommon.showMessageError("Username or password incorrect.");
        }

        /** Tạo Access Token */
        const access_token = await new JwtToken().generateToken({ user_id: user.id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);

        /** Tạo Refresh Token */
        const refresh_token = await new JwtToken().generateToken({ user_id: user.id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

        user.access_token = access_token;
        user.refresh_token = refresh_token;

        await this.userService.update(user.id, user);

        return {
            msg: 'Đăng nhập thành công.',
            access_token: 'Bearer ' + access_token,
            refresh_token: 'Bearer ' + refresh_token,
            user: new UserResponse(user)
        };
    }

    async refreshToken(refreshToken: string, accessToken: string): Promise<any> {
        const decodedAccessToken: JwtTokenInterFace = await new JwtToken().decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedAccessToken || !decodedAccessToken.user_id) {
            UtilsExceptionMessageCommon.showMessageError("Access token không hợp lệ.");
        }

        /** Kiểm tra tính hợp lệ của Refresh Token (so sánh với dữ liệu trong cơ sở dữ liệu) */
        const decodeRefreshToken: JwtTokenInterFace = await new JwtToken().verifyBearerToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const existingUser: User = await this.userService.find(decodeRefreshToken.user_id);

        if (decodeRefreshToken.jwt_token !== existingUser.refresh_token) {
            UtilsExceptionMessageCommon.showMessageError("Refresh token is not valid.");
        }

        /** Tạo Access Token mới */
        const newAccessToken = await new JwtToken().generateToken({ user_id: existingUser.id }, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

        existingUser.access_token = newAccessToken;

        await this.userService.update(existingUser.id, existingUser);

        return {
            access_token: 'Bearer ' + newAccessToken,
            refresh_token: 'Bearer ' + refreshToken,
            user: new UserResponse(existingUser)
        };
    }
}