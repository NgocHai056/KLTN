import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Showtime } from './showtime.entity/showtime.entity';

@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        @InjectRepository(Showtime)
        private readonly showtimeRepository: Repository<Showtime>
    ) {
        super(showtimeRepository);
    }

    /**
     * Lấy xuất chiếu theo từng phim.
     * 
     * @param theaterId 
     * @param movieId 
     * @returns 
     */
    async getTimesByMovieId(theaterId: number, movieId: number): Promise<any> {
        const showtimes = await this.callStoredProcedure(
            "CALL sp_g_list_showtime(?,?,@status,@message);"
            + "SELECT @status AS status_code, @message AS message_error",
            [theaterId, movieId]
        );

        const result = showtimes.list.map(({ time, movie_time }) => (
            {
                date: time,
                times: JSON.parse(movie_time)
                    .filter((item) => item.movie_id === movieId)
                    .map((item) => item.time)
            }));
        return result;
    }
}
