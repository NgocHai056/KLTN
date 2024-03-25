import {
    Body,
    Controller,
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
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { ProductInventoryDto } from "./product-inventory.dto/product-inventory.dto";
import { ProductInventoryService } from "./product-inventory.service";

@Controller({
    version: VersionEnum.V1.toString(),
    path: "unauth/product-inventory",
})
export class ProductInventoryController {
    constructor(
        private readonly productInventoryService: ProductInventoryService,
    ) {}

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: "API create product" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @Body() productInventoryDto: ProductInventoryDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        if (
            (
                await this.productInventoryService.findByCondition({
                    theater_id: productInventoryDto.theater_id,
                    product_id: productInventoryDto.product_id,
                })
            ).length > 0
        ) {
            UtilsExceptionMessageCommon.showMessageError(
                "The product is available in theaters!",
            );
        }

        response.setData(
            await this.productInventoryService.create(productInventoryDto),
        );

        return res.status(HttpStatus.OK).send(response);
    }
}
