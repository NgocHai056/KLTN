import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
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

@Controller({ version: VersionEnum.V1.toString(), path: 'user' })
export class UserController {
    constructor(private userService: UserService) { }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                UserDto
                            ),
                        },
                    },
                },
            ],
        },
    })
    @Get("/:id")
    @ApiOperation({ summary: "API get user by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(new UserResponse(await this.userService.findOne(id)));
        return res.status(HttpStatus.OK).send(response);
    }
}
