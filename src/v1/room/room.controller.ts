import {
    Controller,
    Get,
    Post,
    Body,
    HttpStatus,
    Param,
    ParseIntPipe,
    Res,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";

import { Response } from "express";
import { ApiOkResponse, getSchemaPath, ApiOperation } from '@nestjs/swagger';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { RoomService } from './room.service';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { RoomResponse } from "./room.response/room.response";
import { SwaggerResponse } from "src/utils.common/utils.swagger.common/utils.swagger.response";
import { RoomDto } from "./room.dto/room.dto";

@Controller({ version: VersionEnum.V1.toString(), path: 'room' })
export class RoomController {
    constructor(private roomService: RoomService) { }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(
                                RoomDto
                            ),
                        },
                    },
                },
            ],
        },
    })
    @Post()
    @ApiOperation({ summary: "API create room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() roomDto: RoomDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(new RoomResponse(await this.roomService.create(roomDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get room by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        response.setData(new RoomResponse(await this.roomService.findOne(id)));
        return res.status(HttpStatus.OK).send(response);
    }
}
