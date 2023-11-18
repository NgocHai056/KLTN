import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";


import { Response } from "express";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { UserStatus } from "src/utils.common/utils.enum/user-status.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UpdatePasswordDto } from "./user.dto/user-update-password.dto";
import { UserUpdateDto } from "./user.dto/user-update.dto";
import { UserDto } from "./user.dto/user.dto";
import { UserResponse } from "./user.response/user.response";
import { UserService } from './user.service';


@Controller({ version: VersionEnum.V1.toString(), path: 'auth/user' })
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create user" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() userDto: UserDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new UserResponse(await this.userService.createUser(userDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/delete")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API delete user by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(
        @Param("id") userId: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();
        const user = await this.userService.find(userId);

        if (!user)
            UtilsExceptionMessageCommon.showMessageError("User not exist.");

        response.setData(new UserResponse(await this.userService.update(user.id, { status: UserStatus.STOP_WORKING })));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @ApiOperation({ summary: "API update user by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") userId: string,
        @Body() updateUserDto: UserUpdateDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();
        const user = await this.userService.find(userId);

        Object.assign(user, updateUserDto);

        const data = await this.userService.update(user.id, user);

        response.setData(data ? new UserResponse(data) : []);
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/change-password")
    @ApiOperation({ summary: "API update user by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updatePassword(
        @Param("id") userId: string,
        @Body() updateUserDto: UpdatePasswordDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if (updateUserDto.new_password !== updateUserDto.password_confirm)
            UtilsExceptionMessageCommon.showMessageError("Confirmation password does not match.");

        const user = await this.userService.find(userId);

        if (!user)
            UtilsExceptionMessageCommon.showMessageError("User not exist.");

        const data = await this.userService.updatePassword(userId, updateUserDto);

        response.setData(data ? new UserResponse(data) : []);
        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API get list user" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.userService.findAll());
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get user by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();
        const user = await this.userService.find(id);

        response.setData(user ? new UserResponse(user) : []);
        return res.status(HttpStatus.OK).send(response);
    }
}
