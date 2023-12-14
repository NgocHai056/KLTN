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
    ValidationPipe,
    Query
} from "@nestjs/common";

import { Response } from "express";
import { ApiOperation } from '@nestjs/swagger';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ProductService } from './product.service';
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { ProductDto } from "./product.dto/product.dto";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { PaginationAndSearchDto } from "src/utils.common/utils.pagination/pagination-and-search.dto";
import { GetProductDto } from "./product.dto/get-product.dto";

@Controller({ version: VersionEnum.V1.toString(), path: 'unauth/product' })
export class ProductController {

    constructor(private productService: ProductService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() productDto: ProductDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        if ((await this.productService.findByCondition({ name: { $regex: new RegExp('^' + productDto.name + '$', 'i') } })).length > 0) {
            UtilsExceptionMessageCommon.showMessageError("The product name already exists!");
        }

        response.setData(await this.productService.create(productDto))

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API delete products" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(
        @Body() productIds: string[],
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        response.setData(await this.productService.deleteMany(productIds) ? "Delete successful" : "Unsuccessful");

        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API get list product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Query() productDto: GetProductDto,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response
    ) {
        let response: ResponseData = new ResponseData();

        const query: any = {};

        if (productDto.type)
            query.type = +productDto.type;

        if (pagination.key_search)
            query.$or = [
                { name: { $regex: new RegExp(pagination.key_search, 'i') } }
            ]

        const result = await this.productService.findAllForPagination(+pagination.page, +pagination.page_size, [{ $match: query }]);
        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }
}
