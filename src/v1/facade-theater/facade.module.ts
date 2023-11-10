import { Module } from '@nestjs/common';
import { FacadeService } from './facade.service';
import { TheaterModule } from 'src/v1/theater/theater.module';
import { RoomModule } from 'src/v1/room/room.module';
import { MovieModule } from 'src/v1/movie/movie.module';

@Module({
    imports: [
        TheaterModule,
        RoomModule,
        MovieModule
    ],
    providers: [FacadeService],
    exports: [FacadeService]
})
export class FacadeModule { }
