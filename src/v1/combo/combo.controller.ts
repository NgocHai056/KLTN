import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { ComboDto } from "./combo.dto/combo.dto";
import { ComboService } from "./combo.service";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/combo" })
export class ComboController {
    constructor(private readonly comboService: ComboService) {}

    @Get()
    @ApiOperation({ summary: "API get combo" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.comboService.getCombo());
        return res.status(HttpStatus.OK).send(response);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create combo" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() comboDto: ComboDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.comboService.creaetCombo(comboDto));

        return res.status(HttpStatus.OK).send(response);
    }
}
