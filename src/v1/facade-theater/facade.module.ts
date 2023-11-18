import { Module } from '@nestjs/common';
import { FacadeService } from './facade.service';
import { RoomModule } from 'src/v1/room/room.module';
import { MovieModule } from 'src/v1/movie/movie.module';

@Module({
    imports: [
        RoomModule,
        MovieModule
    ],
    providers: [FacadeService],
    exports: [FacadeService]
})
export class FacadeModule { }
