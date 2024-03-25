import { Module } from "@nestjs/common";
import { ComboController } from "./combo.controller";
import { ComboService } from "./combo.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Combo, ComboSchema } from "./combo.entity/combo.entity";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Combo.name, schema: ComboSchema }]),
        ProductModule,
    ],
    controllers: [ComboController],
    providers: [ComboService],
    exports: [ComboService],
})
export class ComboModule {}
