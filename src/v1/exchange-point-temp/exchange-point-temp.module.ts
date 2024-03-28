import { Module } from "@nestjs/common";
import { ExchangePointTempService } from "./exchange-point-temp.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
    ExchangePoint,
    ExchangePointSchema,
} from "./entities/exchange-point-temp.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ExchangePoint.name, schema: ExchangePointSchema },
        ]),
    ],
    providers: [ExchangePointTempService],
    exports: [ExchangePointTempService],
})
export class ExchangePointTempModule {}
