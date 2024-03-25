import { Module, forwardRef } from "@nestjs/common";
import { ShowtimeService } from "./showtime.service";
import { ShowtimeController } from "./showtime.controller";
import { Showtime, ShowtimeSchema } from "./showtime.entity/showtime.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { FacadeModule } from "src/v1/facade-theater/facade.module";
import { MovieModule } from "../movie/movie.module";
import { GenreModule } from "../genre/genre.module";
import { RoomModule } from "../room/room.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Showtime.name, schema: ShowtimeSchema },
        ]),
        FacadeModule,
        forwardRef(() => MovieModule),
        GenreModule,
        RoomModule,
    ],
    providers: [ShowtimeService],
    controllers: [ShowtimeController],
    exports: [ShowtimeService],
})
export class ShowtimeModule {}
