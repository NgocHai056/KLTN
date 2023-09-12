import { Body, Controller, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { AuthService } from './auth.service';
import { UserDto } from 'src/v1/user/user.dto/user.dto';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { Response } from "express";
import { User } from 'src/v1/user/user.entity/user.entity';
import { ApiOkResponse, ApiOperation, getSchemaPath } from "@nestjs/swagger";
import { UserResponse } from 'src/v1/user/user.response/user.response';
import { SwaggerResponse } from 'src/utils.common/utils.swagger.common/utils.swagger.response';
import { LoginDto } from './auth.dto/login.dto';


@Controller({ version: VersionEnum.V1.toString(), path: 'auth' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                UserResponse
                            ),
                        },
                    },
                },
            ],
        },
    })
    @Post('register')
    @ApiOperation({ summary: "Đăng kí tài khoản" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(
        @Body() registerDto: UserDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let result: User = await this.authService.register(registerDto);

        response.setData(new UserResponse(result));
        return res.status(HttpStatus.OK).send(response);
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                UserResponse
                            ),
                        },
                    },
                },
            ],
        },
    })
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

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                UserResponse
                            ),
                        },
                    },
                },
            ],
        },
    })
    @Post('refresh-token')
    @ApiOperation({ summary: "Refresh token" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async refreshToken(@Req() req, @Res() res: Response): Promise<any> {

        let response: ResponseData = new ResponseData();

        response.setData(await this.authService.refreshToken(req.body.refresh_token, req.headers.authorization));
        return res.status(HttpStatus.OK).send(response);

    }
}
