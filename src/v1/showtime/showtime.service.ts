import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Showtime } from './showtime.entity/showtime.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { MovieService } from '../movie/movie.service';
import { ShowtimeResponse } from './showtime.response/showtime.response';


@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        private readonly movieService: MovieService,
        @InjectModel(Showtime.name) private readonly showtimeRepository: Model<Showtime>) {
        super(showtimeRepository);
    }

    async createShowtime(
        roomId: string, movieId: string, time: string, showtime: string
    ): Promise<any> {
        const condition = { room_id: roomId, time: time };
        const newMovieTime = { movie_id: movieId, time: showtime };

        const showtimes = await this.showtimeRepository.find(condition).exec();

        if (showtimes.length === 0) {
            return await this.showtimeRepository.create({
                room_id: roomId,
                time: time,
                movie_times: [newMovieTime], /** Chèn phần tử mới vào mảng `movie_times`*/
            });
        }

        /** Logic phía trên kiểm tra xem có document nào được tạo trong ngày {time} chưa
         *  Nếu chưa thì thêm mới document. 
         *  Ngược lại thì kiểm tra xem có suất chiếu trong khung giờ {showtime},
         *  chưa có thì mới cập nhật vào document đó.
         */

        const filteredShowtimes = showtimes[0].movie_times
            .filter(item => item.time === showtime)
            .map(item => item.time);

        if (filteredShowtimes.length === 0) {
            return await this.showtimeRepository.findOneAndUpdate(
                condition,
                { $push: { movie_times: newMovieTime } }, /** Sử dụng $push để thêm một phần tử mới*/
                { new: true } /**Tùy chọn này để trả về tài liệu đã cập nhật */
            ).exec();
        }

        UtilsExceptionMessageCommon.showMessageError("Creating a movie screening failed!");
    }

    /**
     * Get list showtime of movie base on request {time}
     * 
     * @param roomIds   List of room_id
     * @param time      The input user enters to filter out movies by date
     * @returns         Returs list of movie contains showtime
     */
    async getShowTimes(roomIds: string[], time: string): Promise<ShowtimeResponse[]> {
        const query = {
            room_id: { $in: roomIds },
            time: time
        };

        const showtime = await this.showtimeRepository.find(query).exec();

        /** Lấy ra {time} và movie_times: [] trong collection showtime*/
        const data = showtime.map(({ time, movie_times }) => (
            {
                date: time,
                times: movie_times
            })
        );

        /** Lấy danh sách id phim sau đó lấy danh sách phim theo id đó */
        const movieIds = data.map(x => x.times.map(movie => movie.movie_id));
        const movies = await this.movieService.findByIds(movieIds[0]);

        /** Ánh xạ thông tin thời gian vào mảng movies */
        return movies.map((movie) => {
            const showtimeResponse = new ShowtimeResponse(movie);
            const movieTimes = data[0].times.filter((movieTime) => {
                return movieTime.movie_id === movie.id;
            });
            showtimeResponse.times = movieTimes.map((movieTime) => movieTime.time);
            return showtimeResponse;
        });
    }
}
