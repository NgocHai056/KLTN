import { Injectable } from '@nestjs/common';
import { MovieService } from 'src/v1/movie/movie.service';
import { RoomService } from 'src/v1/room/room.service';
import { TheaterService } from 'src/v1/theater/theater.service';

@Injectable()
export class FacadeService {
    constructor(
        private readonly theaterService: TheaterService,
        private readonly roomService: RoomService,
        private readonly movieService: MovieService,
    ) { }

    async checkTheaterAndRoomExistence(theaterId: string, roomId: string) {
        await this.theaterService.checkExisting(theaterId);
        await this.roomService.checkExisting(roomId);
    }

    async checkMovieExistence(movieId: string) {
        await this.movieService.checkExisting(movieId);
    }

    async getRoomsByTheaterId(theaterId: string) {
        return await this.roomService.findByCondition({ theater_id: theaterId });
    }
}
