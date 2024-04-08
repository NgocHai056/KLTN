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
import { GetProductDto } from "./product.dto/get-product.dto";
import { ProductDto } from "./product.dto/product.dto";
import { ProductService } from "./product.service";
import { UpdateProductDto } from "./product.dto/update-product.dto";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/product" })
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() productDto: ProductDto, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        if (
            (
                await this.productService.findByCondition({
                    name: {
                        $regex: new RegExp("^" + productDto.name + "$", "i"),
                    },
                })
            ).length > 0
        ) {
            UtilsExceptionMessageCommon.showMessageError(
                "The product name already exists!",
            );
        }

        response.setData(await this.productService.create(productDto));

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API update product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @Param("id") id: string,
        @Body() productDto: UpdateProductDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const product = await this.productService.find(id);
        Object.assign(product, productDto);

        response.setData(await this.productService.update(product.id, product));

        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API delete products" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Body() productIds: string[], @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(
            (await this.productService.deleteMany(productIds))
                ? "Delete successful"
                : "Unsuccessful",
        );

        return res.status(HttpStatus.OK).send(response);
    }

    @Get()
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: "API get list product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(
        @Query() productDto: GetProductDto,
        @Query() pagination: PaginationAndSearchDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const query: any = {};

        if (productDto.type) query.type = +productDto.type;

        if (pagination.key_search)
            query.$or = [
                { name: { $regex: new RegExp(pagination.key_search, "i") } },
            ];

        const result = await this.productService.findAllForPagination(
            +pagination.page,
            +pagination.page_size,
            [{ $match: query }],
        );
        response.setData(result.data);
        response.setTotalRecord(result.total_record);

        return res.status(HttpStatus.OK).send(response);
    }
}
