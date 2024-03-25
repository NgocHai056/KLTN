import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { Banner, BannerSchema } from "./banner.entity/banner.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { FirebaseModule } from "src/firebase/firebase.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Banner.name, schema: BannerSchema },
        ]),
        FirebaseModule,
    ],
    providers: [BannerService],
    controllers: [BannerController],
})
export class BannerModule {}
