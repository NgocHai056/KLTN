import { Injectable } from "@nestjs/common";
import BaseService from "src/base.service/base.service";
import { ExchangePoint } from "./entities/exchange-point-temp.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ExchangePointTempService extends BaseService<ExchangePoint> {
    constructor(
        @InjectModel(ExchangePoint.name)
        private readonly exchangePointModel: Model<ExchangePoint>,
    ) {
        super(exchangePointModel);
    }
}
