import { Module } from "@nestjs/common";
import { TheaterService } from "./theater.service";
import { TheaterController } from "./theater.controller";
import { Theater, TheaterSchema } from "./theater.entity/theater.entity";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Theater.name, schema: TheaterSchema },
        ]),
    ],
    providers: [TheaterService],
    controllers: [TheaterController],
    exports: [TheaterService],
})
export class TheaterModule {}
