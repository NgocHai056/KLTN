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
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { TicketPriceDto } from "./ticket-price.dto/ticket-price.dto";
import { TicketPriceService } from "./ticket-price.service";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/ticket-price" })
export class TicketPriceController {
    constructor(private readonly ticketPriceService: TicketPriceService) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Create ticket price" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() ticketPriceDto: TicketPriceDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.ticketPriceService.create(ticketPriceDto));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Update ticket price" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() ticketPriceDto: TicketPriceDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        response.setData(
            await this.ticketPriceService.update(id, ticketPriceDto),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "Get all ticket price" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const result = await this.ticketPriceService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
        );
        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }
}
