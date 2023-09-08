import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtToken } from 'src/utils.common/utils.jwt-token.common/utils.jwt-token.common';
import { JwtTokenInterFace } from 'src/utils.common/utils.jwt-token.common/utils.jwt-token.interface.common';
import { UserDto } from 'src/v1/user/user.dto/user.dto';
import { User } from 'src/v1/user/user.entity/user.entity';
import { UserService } from 'src/v1/user/user.service';
import { LoginDto } from './auth.dto/login-dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) { }

    async register(registerDto: UserDto): Promise<User> {
        /** Kiểm tra xem tên người dùng đã tồn tại hay chưa */
        const existingUser = await this.userService.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Tên tài khoản đã tồn tại.');
        }

        /** Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu */
        const hashedPassword: string = await bcrypt.hash(registerDto.password, await bcrypt.genSalt());

        registerDto.password = hashedPassword;

        return await this.userService.create(registerDto);
    }

    async login(loginDto: LoginDto) {
        const user: User = await this.userService.findOneByEmail(loginDto.email);
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác.');
        }

        /** Tạo Access Token */
        const accessToken = await new JwtToken().generateToken({ user_id: user.id }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);

        /** Tạo Refresh Token */
        const refreshToken = await new JwtToken().generateToken({ user_id: user.id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

        user.access_token = accessToken;
        user.refresh_token = refreshToken;

        await this.userService.update(user.id, user);

        return {
            msg: 'Đăng nhập thành công.',
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken: string, accessToken: string): Promise<any> {
        const decodedAccessToken: JwtTokenInterFace = await new JwtToken().decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedAccessToken || !decodedAccessToken.user_id) {
            throw new UnauthorizedException('Access token không hợp lệ.');
        }

        /** Kiểm tra tính hợp lệ của Refresh Token (so sánh với dữ liệu trong cơ sở dữ liệu) */
        const decodeRefreshToken: JwtTokenInterFace = await new JwtToken().verifyBearerToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const existingUser: User = await this.userService.findOne(decodeRefreshToken.user_id);

        if (decodeRefreshToken.jwt_token !== existingUser.refresh_token) {
            throw new UnauthorizedException('Refresh token không hợp lệ.');
        }

        /** Tạo Access Token mới */
        const newAccessToken = await new JwtToken().generateToken({ user_id: existingUser.id }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

        existingUser.access_token = newAccessToken;

        await this.userService.update(existingUser.id, existingUser);

        return {
            accessToken: newAccessToken,
        };
    }
}