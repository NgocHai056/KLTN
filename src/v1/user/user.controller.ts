import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, getSchemaPath } from "@nestjs/swagger";


import { Response } from "express";
import { UserService } from './user.service';
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { SwaggerResponse } from "src/utils.common/utils.swagger.common/utils.swagger.response";
import { UserDto } from "./user.dto/user.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UserResponse } from "./user.response/user.response";
import { UserUpdateDto } from "./user.dto/user-update.dto";

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/user' })
export class UserController {
    constructor(private userService: UserService) { }

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
