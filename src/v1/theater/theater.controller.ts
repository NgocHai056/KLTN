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
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { TheaterDto } from "./theater.dto/theater.dto";
import { TheaterResponse } from "./theater.response/theater.response";
import { TheaterService } from "./theater.service";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/theater" })
export class TheaterController {
    constructor(private theaterService: TheaterService) {}

    @Post("/delete")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API delete theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Body() theaterIds: string[], @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const theaters = await this.theaterService.findByIds(theaterIds);

        if (theaters.length === 0)
            UtilsExceptionMessageCommon.showMessageError("Theater not exist.");

        const status = theaters[0].status == 0 ? 1 : 0; // Trang thai 0: tat, 1: bat

        response.setData(
            (await this.theaterService.updateMany(
                { _id: { $in: theaters.flatMap((x) => x.id) } },
                { $set: { status: status } },
            ))
                ? { msg: "Update successful." }
                : { msg: "Update failed." },
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API update theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() theaterDto: TheaterDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const theater = await this.theaterService.find(id);

        if (!theater)
            UtilsExceptionMessageCommon.showMessageError("Theater not exist.");

        Object.assign(theater, theaterDto);

        response.setData(
            new TheaterResponse(await this.theaterService.update(id, theater)),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() theaterDto: TheaterDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(
            new TheaterResponse(await this.theaterService.create(theaterDto)),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @ApiOperation({ summary: "API get list theater" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(
            TheaterResponse.mapToList(
                (await this.theaterService.findAll()).filter(
                    (theater) => theater.status !== 0,
                ),
            ),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/admin")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API get list theater for admin" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAllAdmin(
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const query: any = {};

        const keySearch = pagination.key_search;

        if (keySearch !== "") {
            query.$or = [
                { name: { $regex: new RegExp(keySearch, "i") } },
                { address: { $regex: new RegExp(keySearch, "i") } },
            ];
        }

        const result = await this.theaterService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
            [{ $match: query }],
        );
        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id")
    @ApiOperation({ summary: "API get theater by id" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOne(@Param("id") id: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const theater = await this.theaterService.find(id);

        if (!theater || theater.status === 0)
            UtilsExceptionMessageCommon.showMessageError("Theater not exist.");

        response.setData(new TheaterResponse(theater));
        return res.status(HttpStatus.OK).send(response);
    }
}
