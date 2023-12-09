import { Injectable } from '@nestjs/common';
import { MovieService } from 'src/v1/movie/movie.service';
import { RoomService } from 'src/v1/room/room.service';

@Injectable()
export class FacadeService {
    constructor(
        private readonly roomService: RoomService,
        private readonly movieService: MovieService
    ) { }

    async checkTheaterRoomAndMovieExistence(theaterId: string, roomId: string, movieId: string) {
        await this.roomService.checkExistRoomAndTheater(roomId, theaterId);
        await this.movieService.checkExisting(movieId);
    }

    async checkRoomAndMovieExistence(roomId: string, movieId: string) {
        if (roomId)
            await this.roomService.checkExisting(roomId);
        if (movieId)
            await this.movieService.checkExisting(movieId);
    }

    async getRoomsByTheaterId(theaterId: string) {
        return await this.roomService.getRoomsByTheaterId(theaterId);
    }

    async getRoom(roomId: string) {
        return await this.roomService.find(roomId);
    }
}
