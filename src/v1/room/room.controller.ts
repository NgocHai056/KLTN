import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { TheaterService } from "../theater/theater.service";
import { RoomDto } from "./room.dto/room.dto";
import { RoomResponse } from "./room.response/room.response";
import { RoomService } from "./room.service";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/room" })
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly theaterService: TheaterService,
    ) {}

    @Post()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API create room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() roomDto: RoomDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        if (!(await this.theaterService.find(roomDto.theater_id))) {
            UtilsExceptionMessageCommon.showMessageError(
                "Movie theaters don't exist",
            );
        }

        const rooms = await this.roomService.getRoomsByTheaterId(
            roomDto.theater_id,
        );

        const duplicateRoom = rooms.find(
            (room) => room.room_number === roomDto.room_number,
        );

        if (duplicateRoom) {
            UtilsExceptionMessageCommon.showMessageError(
                "Room_number already exists!",
            );
        }

        response.setData(
            new RoomResponse(await this.roomService.create(roomDto)),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API update room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") roomId: string,
        @Body() roomDto: RoomDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const room = await this.roomService.find(roomId);

        if (!room)
            UtilsExceptionMessageCommon.showMessageError("Room not exists!");

        if (
            !roomDto.theater_id &&
            !(await this.theaterService.find(roomDto.theater_id))
        )
            UtilsExceptionMessageCommon.showMessageError(
                "Movie theaters don't exist",
            );

        const rooms = await this.roomService.getRoomsByTheaterId(
            roomDto.theater_id,
        );

        const duplicateRoom = rooms.find(
            (room) =>
                room.room_number === roomDto.room_number && room.id !== roomId,
        );

        if (duplicateRoom)
            UtilsExceptionMessageCommon.showMessageError(
                "Room_number already exists!",
            );

        Object.assign(room, roomDto);

        response.setData(
            new RoomResponse(await this.roomService.update(roomId, room)),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "API delete room" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Body() roomIds: string[], @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const rooms = await this.roomService.findByIds(roomIds);

        if (rooms.length === 0)
            UtilsExceptionMessageCommon.showMessageError("Rooms not exist.");

        const status = rooms[0].status === 0 ? 1 : 0;

        response.setData(
            (await this.roomService.updateMany(
                { _id: { $in: rooms.flatMap((x) => x.id) } },
                { $set: { status: status } },
            ))
                ? { msg: "Update successful." }
                : { msg: "Update failed." },
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/by-theater")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API get all room by theater id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllByTheater(@GetUser() user: UserModel, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(
            RoomResponse.mapToList(
                (
                    await this.roomService.findByCondition({
                        theater_id: user.theater_id,
                    })
                ).filter((x) => x.status !== 0),
            ),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "API get all room for admin" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const result = await this.roomService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
        );
        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API get room by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param("id") id: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const room = await this.roomService.find(id);

        if (!room || room.status === 0)
            UtilsExceptionMessageCommon.showMessageError("Room not exist.");

        response.setData(new RoomResponse(room));
        return res.status(HttpStatus.OK).send(response);
    }
}
