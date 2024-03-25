import { Injectable } from "@nestjs/common";
import BaseService from "src/base.service/base.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductInventory } from "./product-inventory.entity/product-inventory.entity";

@Injectable()
export class ProductInventoryService extends BaseService<ProductInventory> {
    constructor(
        @InjectModel(ProductInventory.name)
        private readonly productInventoryRepository: Model<ProductInventory>,
    ) {
        super(productInventoryRepository);
    }
}
