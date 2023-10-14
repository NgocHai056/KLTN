import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Showtime } from './showtime.entity/showtime.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { MovieService } from '../movie/movie.service';
import { ShowtimeResponse } from './showtime.response/showtime.response';
import { SeatService } from '../seat/seat.service';


@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        private readonly movieService: MovieService,
        private readonly seatService: SeatService,
        @InjectModel(Showtime.name) private readonly showtimeRepository: Model<Showtime>) {
        super(showtimeRepository);
    }

    async createShowtime(
        roomId: string, movieId: string, time: string, showtime: string
    ) {
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
        const showtimes = await this.getShowTimesByTime(roomIds, time);

        /** Get list movieId base on showtimes and then get list movies */
        const movieIds = showtimes.map(showtime => showtime.times.map(movieTime => movieTime.movie_id)).flat();
        const movies = await this.movieService.findByIds(movieIds);

        const seatConditions = {
            room_id: { $in: roomIds },
            movie_id: { $in: movieIds },
            time: time,
        };

        const seats = await this.seatService.findByCondition(seatConditions);

        /** Map value of seats follow key: room_id, movie_id, time, showtime */
        const seatMap = {};
        seats.forEach(seat => {
            const key = `${seat.room_id}_${seat.movie_id}_${seat.time}_${seat.showtime}`;
            seatMap[key] = seat._id;
        });

        return movies.map(movie => {
            const showtimeResponse = new ShowtimeResponse(movie);

            let times: any[] = [];

            showtimes.forEach(showtime => {
                const movieTimes = showtime.times.filter(movieTime => movieTime.movie_id === movie.id);

                const timesForMovie = movieTimes.map(movieTime => {
                    const key = `${showtime.room_id}_${movie.id}_${showtime.date}_${movieTime.time}`;
                    const seat_id = seatMap[key];
                    return {
                        showtime: {
                            _id: showtime.id,
                            time: movieTime.time
                        },
                        seat: {
                            _id: seat_id ? seat_id : 0,
                            room_id: showtime.room_id
                        }
                    };
                });

                /** Chỉ push nếu timesForMovie không rỗng*/
                if (timesForMovie.length > 0) {
                    times.push(timesForMovie);
                }
            });

            showtimeResponse.times = times;

            return showtimeResponse;
        });

    }

    /**
     * Check to see if a showtime exists
     * 
     * @param roomIds 
     * @param movieId 
     * @param time 
     * @returns 
     */
    async checkExistShowtime(roomIds: string[], movieId: string, time: string, showtime: string) {
        const data = await this.getShowTimesByTime(roomIds, time);

        if (data.length === 0) {
            UtilsExceptionMessageCommon.showMessageError("Ticket booking failed because there are no screenings for this movie!");
        }

        return data[0].times
            .filter(movieTime => movieTime.movie_id === movieId && movieTime.time === showtime)
            .map(movieTime => ({
                room_id: data[0].room_id,
                movie_id: movieTime.movie_id,
                time: movieTime.time,
            }));
    }

    async getShowTimesByTime(roomIds: string[], time: string) {
        const query = {
            room_id: { $in: roomIds },
            time: time
        };

        const showtime = await this.showtimeRepository.find(query).exec();

        /** Lấy ra {time} và movie_times: [] trong collection showtime*/
        return showtime.map(({ _id, room_id, time, movie_times }) => (
            {
                id: _id,
                room_id: room_id,
                date: time,
                times: movie_times
            })
        );
    }
}
