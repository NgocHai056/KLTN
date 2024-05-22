import { HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mail/mail.service";
import { OtpService } from "src/otp/otp.service";
import { Role } from "src/utils.common/utils.enum/role.enum";
import { UserStatus } from "src/utils.common/utils.enum/user-status.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { JwtToken } from "src/utils.common/utils.jwt-token.common/utils.jwt-token.common";
import { JwtTokenInterFace } from "src/utils.common/utils.jwt-token.common/utils.jwt-token.interface.common";
import { TheaterService } from "src/v1/theater/theater.service";
import { ForgotPasswordDto } from "src/v1/user/user.dto/user-forgot-password.dto";
import { UserDto } from "src/v1/user/user.dto/user.dto";
import { User } from "src/v1/user/user.entity/user.entity";
import { UserModel } from "src/v1/user/user.entity/user.model";
import { UserResponse } from "src/v1/user/user.response/user.response";
import { UserService } from "src/v1/user/user.service";
import { LoginDto } from "./auth.dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,
        private readonly theaterService: TheaterService,
        private mailService: MailService,
    ) {}

    async signUp(user: UserDto): Promise<User> {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        await this.userService.checkExisting(user.email, user.phone);

        this.genCodeAndSendOtp(
            user.email,
            user.name,
            "'Welcome to NHCinema! Please validate you address…'",
            "./confirmation",
        );

        /** Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu */
        const hashedPassword: string = await bcrypt.hash(
            user.password,
            await bcrypt.genSalt(),
        );

        return await this.userService.create({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: hashedPassword,
            status: UserStatus.NOT_ACTIVATED,
            expireAt: new Date(),
        });
    }

    async verifyAccount(userId: string, otp: string) {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        const user = await this.userService.find(userId);

        if (!user)
            UtilsExceptionMessageCommon.showMessageError(
                "This account does not exist.",
            );

        await this.otpService.checkExisting(user.email, otp);

        /** Tạo Access Token */
        const access_token = await new JwtToken().generateToken(
            { user_id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            process.env.ACCESS_TOKEN_LIFE,
        );

        /** Tạo Refresh Token */
        const refresh_token = await new JwtToken().generateToken(
            { user_id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_LIFE,
        );

        const data = await this.userService.update(userId, {
            status: UserStatus.ACTIVATED,
            access_token: access_token,
            refresh_token: refresh_token,
            $unset: { expireAt: 1 },
        });

        return this.commonResponse(
            "Verify successfully.",
            data.access_token,
            data.refresh_token,
            data,
        );
    }

    async forgot(email: string): Promise<User> {
        const user = await this.userService.findByEmail(email);

        if (user.length === 0)
            UtilsExceptionMessageCommon.showMessageError("Email not exist.");

        this.genCodeAndSendOtp(
            user[0].email,
            user[0].name,
            "Regenerate password for NHCinema account",
            "./forgot-password",
        );

        return user[0];
    }

    async forgotConfirm(userId: string, updateUserDto: ForgotPasswordDto) {
        if (updateUserDto.password !== updateUserDto.confirm_password)
            UtilsExceptionMessageCommon.showMessageError(
                "Confirmation password does not match.",
            );

        return await this.userService.updatePassword(
            userId,
            updateUserDto.password,
        );
    }

    async genCodeAndSendOtp(
        email: string,
        name: string,
        msg: string,
        template: string,
    ) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        /** Send code to email for confirmation */
        await this.mailService.sendConfirmation(email, msg, template, {
            name: name,
            code,
        });

        await this.otpService.create({
            code,
            email: email,
            expireAt: new Date(),
        });
    }

    async login(loginDto: LoginDto) {
        const users = await this.userService.findByCondition({
            email: { $regex: new RegExp("^" + loginDto.email + "$", "i") },
        });

        const user: User = users.pop();

        if (!user || user.status === UserStatus.STOP_WORKING)
            UtilsExceptionMessageCommon.showMessageError("User not exist.");

        if (!(await bcrypt.compare(loginDto.password, user.password))) {
            UtilsExceptionMessageCommon.showMessageError(
                "Username or password incorrect.",
            );
        }

        /** Tạo Access Token */
        const access_token = await new JwtToken().generateToken(
            { user_id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            process.env.ACCESS_TOKEN_LIFE,
        );

        /** Tạo Refresh Token */
        const refresh_token = await new JwtToken().generateToken(
            { user_id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_LIFE,
        );

        user.access_token = access_token;
        user.refresh_token = refresh_token;

        await this.userService.update(user.id, user);

        return this.commonResponse(
            "Logged in successfully.",
            access_token,
            refresh_token,
            user,
        );
    }

    async logout(userModel: UserModel) {
        const user = await this.userService.find(userModel.id);

        user.access_token = user.refresh_token = "";

        await this.userService.update(user.id, user);

        return {
            msg: "Đăng xuất thành công.",
        };
    }

    async refreshToken(
        refreshToken: string,
        accessToken: string,
    ): Promise<any> {
        const decodedAccessToken: JwtTokenInterFace =
            await new JwtToken().decodeToken(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET,
            );

        if (!decodedAccessToken || !decodedAccessToken.user_id) {
            UtilsExceptionMessageCommon.showMessageErrorAndStatus(
                "Access token is not valid.",
                HttpStatus.UNAUTHORIZED,
            );
        }

        /** Kiểm tra tính hợp lệ của Refresh Token (so sánh với dữ liệu trong cơ sở dữ liệu) */
        const decodeRefreshToken: JwtTokenInterFace =
            await new JwtToken().verifyBearerToken(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
            );

        if (decodedAccessToken.user_id !== decodeRefreshToken.user_id)
            UtilsExceptionMessageCommon.showMessageErrorAndStatus(
                "Refresh token failed.",
                HttpStatus.UNAUTHORIZED,
            );

        const existingUser: User = await this.userService.find(
            decodeRefreshToken.user_id,
        );

        if (decodeRefreshToken.jwt_token !== existingUser.refresh_token) {
            UtilsExceptionMessageCommon.showMessageErrorAndStatus(
                "Refresh token is not valid.",
                HttpStatus.UNAUTHORIZED,
            );
        }

        /** Tạo Access Token mới */
        const newAccessToken = await new JwtToken().generateToken(
            { user_id: existingUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_LIFE,
        );

        existingUser.access_token = newAccessToken;

        await this.userService.update(existingUser.id, existingUser);

        return this.commonResponse(
            "Logged in successfully.",
            newAccessToken,
            refreshToken,
            existingUser,
        );
    }

    private async commonResponse(
        message: string,
        accessToken: string,
        refreshToken: string,
        user: User,
    ) {
        return {
            msg: message,
            access_token: "Bearer " + accessToken,
            refresh_token: "Bearer " + refreshToken,
            user: new UserResponse(user),
            theater:
                user.role === Role.MANAGER
                    ? await this.theaterService.find(user.theater_id)
                    : {},
        };
    }
}
