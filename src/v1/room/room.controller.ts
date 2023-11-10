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

import { ApiOperation } from '@nestjs/swagger';
import { Response } from "express";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { TheaterService } from "../theater/theater.service";
import { RoomDto } from "./room.dto/room.dto";
import { RoomResponse } from "./room.response/room.response";
import { RoomService } from './room.service';
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/room' })
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly theaterService: TheaterService
    ) { }

    @Post()
    @Roles(Role.MANAGER, Role.ADMIN)
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

    @Post("/:id/update")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API update room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") roomId: string,
        @Body() roomDto: RoomDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const room = await this.roomService.find(roomId);

        if (!room)
            UtilsExceptionMessageCommon.showMessageError("Room not exists!");

        if (!roomDto.theater_id && !await this.theaterService.find(roomDto.theater_id))
            UtilsExceptionMessageCommon.showMessageError("Movie theaters don't exist");

        const rooms = await this.roomService.getRoomsByTheaterId(roomDto.theater_id);

        const duplicateRoom = rooms.find(room => room.room_number === roomDto.room_number && room.id !== roomId);

        if (duplicateRoom)
            UtilsExceptionMessageCommon.showMessageError("Room_number already exists!");

        Object.assign(room, roomDto);

        response.setData(new RoomResponse(await this.roomService.update(roomId, room)));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/by-theater")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API get all room by theater id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllByTheater(
        @GetUser() user: UserModel,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(RoomResponse.mapToList(await this.roomService.findByCondition({ theater_id: user.theater_id })));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API get all room for admin" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(RoomResponse.mapToList(await this.roomService.findAll()));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @Roles(Role.MANAGER, Role.ADMIN)
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
