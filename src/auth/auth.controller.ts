import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { AuthService } from './auth.service';
import { UserDto } from 'src/v1/user/user.dto/user.dto';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { Response } from "express";
import { User } from 'src/v1/user/user.entity/user.entity';
import { ApiOperation } from "@nestjs/swagger";
import { UserResponse } from 'src/v1/user/user.response/user.response';
import { LoginDto } from './auth.dto/login.dto';
import { VerifyDto } from './auth.dto/verify.dto';
import { UserModel } from 'src/v1/user/user.entity/user.model';
import { GetUser } from 'src/utils.common/utils.decorator.common/utils.decorator.common';
import { ForgotPasswordDto } from 'src/v1/user/user.dto/user-forgot-password.dto';


@Controller({ version: VersionEnum.V1.toString(), path: 'oauth' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: "Đăng kí tài khoản" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(
        @Body() registerDto: UserDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new UserResponse(await this.authService.signUp(registerDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post('verify')
    @ApiOperation({ summary: "Đăng kí tài khoản" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async verifyAccount(
        @Body() verifyDto: VerifyDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData((await this.authService.verifyAccount(verifyDto.user_id, verifyDto.otp)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post('login')
    @ApiOperation({ summary: "Đăng nhập" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response) {

        let response: ResponseData = new ResponseData();

        let result = await this.authService.login(loginDto);

        response.setData(result);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get('logout')
    @ApiOperation({ summary: "Đăng xuất" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async logout(
        @GetUser() user: UserModel,
        @Res() res: Response) {

        let response: ResponseData = new ResponseData();

        response.setData(await this.authService.logout(user));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/forgot-password")
    @ApiOperation({ summary: "API forgot password" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async forgotPassword(
        @Body() email: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData({ _id: (await this.authService.forgot(email)).id });
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/forgot-password-confirm")
    @ApiOperation({ summary: "API forgot password" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async forgotPasswordConfirm(
        @Body() forgotDto: ForgotPasswordDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new UserResponse(await this.authService.forgotConfirm(forgotDto.user_id, forgotDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: "Refresh token" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async refreshToken(@Req() req, @Res() res: Response) {

        let response: ResponseData = new ResponseData();

        response.setData(await this.authService.refreshToken(req.body.refresh_token, req.body.access_token));
        return res.status(HttpStatus.OK).send(response);

    }
}
