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
import { TheaterService } from "../theater/theater.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/room' })
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly theaterService: TheaterService
    ) { }

    @Post()
    @Roles(Role.Admin)
    @ApiOperation({ summary: "API create room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() roomDto: RoomDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if (!await this.theaterService.find(roomDto.theater_id)) {
            UtilsExceptionMessageCommon.showMessageError("Movie theaters don't exist");
        }

        const rooms = await this.roomService.getRoomsByTheaterId(roomDto.theater_id);

        const duplicateRoom = rooms.find(room => room.room_number === roomDto.room_number);

        if (duplicateRoom) {
            UtilsExceptionMessageCommon.showMessageError("Room_number already exists!");
        }

        response.setData(new RoomResponse(await this.roomService.create(roomDto)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get room by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(new RoomResponse(await this.roomService.find(id)));
        return res.status(HttpStatus.OK).send(response);
    }
}
