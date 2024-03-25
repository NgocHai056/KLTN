import { Injectable } from "@nestjs/common";
import BaseService from "src/base.service/base.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./product.entity/product.entity";

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        @InjectModel(Product.name)
        private readonly productRepository: Model<Product>,
    ) {
        super(productRepository);
    }
}
