import { Module, forwardRef } from "@nestjs/common";
import { MovieModule } from "src/v1/movie/movie.module";
import { RoomModule } from "src/v1/room/room.module";
import { FacadeService } from "./facade.service";

@Module({
    imports: [RoomModule, forwardRef(() => MovieModule)],
    providers: [FacadeService],
    exports: [FacadeService],
})
export class FacadeModule {}
