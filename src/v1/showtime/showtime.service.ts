import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Showtime } from './showtime.entity/showtime.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';
import { MovieService } from '../movie/movie.service';
import { ShowtimeByDayResponse } from './showtime.response/showtime-by-day.response';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.format-time.common';
import { SeatStatus } from 'src/utils.common/utils.enum/seat-status.enum';
import * as moment from 'moment-timezone';

@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        private readonly movieService: MovieService,
        @InjectModel(Showtime.name) private readonly showtimeRepository: Model<Showtime>) {
        super(showtimeRepository);
    }

    async createShowtime(
        roomId: string, movieId: string, time: string, showtime: string
    ) {
        /** Check if the showtime have time and showtime exist. If not then create */
        const condition = { room_id: roomId, time: time };

        const showtimes = await this.showtimeRepository.find(condition).exec();

        /** Tách giờ phút sau đó tính số phút để check khoảng cách giữa các suất chiếu */
        const newTimeInMinutes = parseInt(showtime.split(":")[0]) * 60 + parseInt(showtime.split(":")[1]);

        const timeArrayInMinutes = showtimes.map(item => {
            const [hours, minutes] = item.showtime.split(":");
            return parseInt(hours) * 60 + parseInt(minutes);
        });

        /** Kiểm tra xem giờ mới có hợp lệ không */
        const isTimeValid = timeArrayInMinutes.every(time => Math.abs(time - newTimeInMinutes) >= 150);

        if (!isTimeValid) {
            UtilsExceptionMessageCommon.showMessageError("The interval between screenings must be at least 150 minutes!");
        }

        const showtimeByRoom = showtimes.filter(item => item.showtime === showtime);

        /** Check if room exist in showtime base on times input */
        if (showtimeByRoom.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("Showtimes are available for this room. Please review the room_id for create new showtime!");
        }

        return await this.showtimeRepository.create({
            room_id: roomId,
            movie_id: movieId,
            time: time,
            showtime: showtime,
            seat_array: [], /** Chèn phần tử mới vào mảng `seat_array`*/
        });

    }

    /**
     * Get list showtime of movie base on request {time}
     * 
     * @param roomIds   List of room_id
     * @param time      The input user enters to filter out movies by date
     * @returns         Returs list of movie contains showtime
     */
    async getShowTimes(roomIds: string[], time: string): Promise<ShowtimeByDayResponse[]> {
        const query = {
            room_id: { $in: roomIds },
            time: time,
        };

        const showtimes = await this.showtimeRepository.find(query).exec();


        /** Get list movieId base on showtimes and then get list movies */
        const movieIds = showtimes.map(showtime => showtime.movie_id).flat();
        const movies = await this.movieService.findByIds(movieIds);

        /** Map showtime and showtime_id follow each movie */
        return movies.map(movie => {
            const showtimeResponse = new ShowtimeByDayResponse(movie);

            showtimeResponse.times =
                showtimes
                    .filter(showtime => showtime.movie_id === movie.id)
                    .map(showtime => ({
                        time: showtime.showtime,
                        showtime_id: showtime.id
                    }));

            return showtimeResponse;
        });

    }

    async getShowTimeByMovie(roomIds: string[], movieId: string): Promise<ShowtimeByDayResponse[]> {
        const currentDate = moment();

        const nextDate = moment().add(4, 'days');

        const query = {
            room_id: { $in: roomIds },
            movie_id: movieId,
            time: {
                $gte: currentDate.format("YYYY-MM-DD"),
                $lte: nextDate.format("YYYY-MM-DD")
            }
        };

        const showtimes = await this.showtimeRepository.find(query).exec();

        const movie = await this.movieService.find(movieId);

        /** Map showtime and showtime_id follow each movie */

        const showtimeResponse = new ShowtimeByDayResponse(movie);

        showtimeResponse.times =
            showtimes
                .filter(showtime => showtime.movie_id === movie.id)
                .map(showtime => ({
                    time: showtime.time,
                    showtime: showtime.showtime,
                    showtime_id: showtime.id
                }));

        return [showtimeResponse];
    }

    async checkSeatStatus(showtimeId: string) {

        await this.validateObjectId(showtimeId, "showtime ID");

        const data = await this.showtimeRepository.findById(showtimeId).exec();

        const currentTime = new Date();

        /** Filter of expired time and remove each element expired */
        const filteredSeats = data.seat_array.filter(seat => {
            return ((currentTime.getTime() - new Date(seat.time_order).getTime()) >= 0 && seat.status === SeatStatus.PENDING);
        });

        const seatNumbers = filteredSeats.map(seat => seat.seat_number);

        return await this.showtimeRepository.findByIdAndUpdate(
            showtimeId,
            {
                $pull: {
                    seat_array: {
                        seat_number: { $in: seatNumbers }
                    }
                }
            },
            { new: true }
        ).exec();;

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
        const query = {
            room_id: { $in: roomIds },
            movie_id: movieId,
            time: time,
            showtime: showtime
        };

        const showtimes = await this.showtimeRepository.find(query).exec();

        if (showtimes.length === 0) {
            UtilsExceptionMessageCommon.showMessageError("Ticket booking failed because there are no screenings for this movie!");
        }

        return showtimes;
    }
}
