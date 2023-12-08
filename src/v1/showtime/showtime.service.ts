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
import { GenreService } from '../genre/genre.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FacadeService } from '../facade-theater/facade.service';
import { RoomService } from '../room/room.service';
import { PaginationAndSearchDto } from 'src/utils.common/utils.pagination/pagination-and-search.dto';
import { showtimeAraay } from 'src/utils.common/utils.enum/showtime.const';

@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        private readonly movieService: MovieService,
        private readonly genreService: GenreService,
        private readonly roomService: RoomService,
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

    async copyShowtime(
        roomIds: string[], time: string, targetTime: string
    ) {
        /** Find by list room_id of theater and time for copy list showtime of day specific */
        const query = {
            room_id: { $in: roomIds },
            time: time,
        };

        const showtimes = await this.showtimeRepository.find(query).exec();

        const copiedShowtimes = showtimes.map(showtime => {
            return {
                room_id: showtime.room_id,
                movie_id: showtime.movie_id,
                time: targetTime,
                showtime: showtime.showtime,
                seat_array: []
            }
        })

        return await this.showtimeRepository.insertMany(copiedShowtimes);
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
            time: time
        };

        const showtimes = await this.showtimeRepository.find(query).exec();


        /** Get list movieId base on showtimes and then get list movies */
        const movieIds = showtimes.map(showtime => showtime.movie_id).flat();
        const movies = await this.movieService.findByIds(movieIds);

        const gernes = await this.genreService.findAll();

        const genreMap = {};
        gernes.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });

        /** Map showtime and showtime_id follow each movie */
        return movies.map(movie => {
            const showtimeResponse = new ShowtimeByDayResponse(movie);

            showtimeResponse.genres = movie.genres.map(id => genreMap[id]).join(", ");

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

    async findAllByTheater(roomIds: string[], movieId: string, time: string, pagination: PaginationAndSearchDto) {
        const query: any = {
            room_id: { $in: roomIds }
        }

        if (movieId)
            query.movie_id = movieId;

        if (time)
            query.time = time;

        const aggregationPipeline = [
            { $match: query },
            {
                $addFields: {
                    movie_id: { $toObjectId: '$movie_id' } // Chuyển đổi movie_id từ chuỗi sang ObjectId
                }
            },
            {
                $addFields: {
                    room_id: { $toObjectId: '$room_id' } // Chuyển đổi room_id từ chuỗi sang ObjectId
                }
            },
            {
                $lookup: {
                    from: 'movies', // Tên của collection movies
                    localField: 'movie_id',
                    foreignField: '_id',
                    as: 'movieInfo'
                }
            },
            {
                $lookup: {
                    from: 'rooms', // Tên của collection rooms
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'roomInfo'
                }
            },
            { $sort: { "time": -1, "showtime": -1 } },
            {
                $project: {
                    _id: 1,
                    room_id: 1,
                    movie_id: 1,
                    time: 1,
                    showtime: 1,
                    seat_array: 1,
                    created_at: 1,
                    updated_at: 1,
                    __v: 1,
                    movie_name: { $arrayElemAt: ['$movieInfo.name', 0] }, // Lấy name từ movieInfo
                    room_name: { $arrayElemAt: ['$roomInfo.room_number', 0] } // Lấy name từ roomInfo
                }
            }
        ];

        return await this.findAllForPagination(+pagination.page, +pagination.page_size, aggregationPipeline);
    }

    async getShowTimeByMovie(roomIds: string[], movieId: string): Promise<ShowtimeByDayResponse[]> {
        const currentDate = moment();

        const nextDate = moment().add(3, 'days');

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
            showtimes.reduce((acc, showtime) => {
                const existingItem = acc.find(item => item.time === showtime.time);

                if (existingItem) {
                    existingItem.showtimes.push({
                        showtime: showtime.showtime,
                        showtime_id: showtime.id
                    });
                } else {
                    acc.push({
                        time: showtime.time,
                        showtimes: [{
                            showtime: showtime.showtime,
                            showtime_id: showtime.id
                        }]
                    });
                }

                return acc;
            }, []);

        /** Sort showtime increase */
        showtimeResponse.times = showtimeResponse.times.sort((a, b) => a.time.localeCompare(b.time));

        showtimeResponse.times = showtimeResponse.times.map(item => {
            return {
                time: UtilsDate.formatDateVN(new Date(item.time)),
                showtimes: item.showtimes
            }
        });

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

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async autoCreateShowtime() {

        const nextDate = moment().add(4, 'days');

        const rooms = await this.roomService.findByCondition({ status: { $ne: 0 } })
        const movies = await this.movieService.findMovieBeforeDateRelease();


        const showtimeRoom = {};

        rooms.forEach((room) => {
            showtimeRoom[room.theater_id] = {};
            showtimeAraay.forEach((showtime) => {
                showtimeRoom[room.theater_id][showtime] = [];
            });
        });

        const createShowtime = (roomId: string, movieId: string, time: string, showtime: string) => {
            return {
                room_id: roomId,
                movie_id: movieId,
                time: time,
                showtime: showtime,
                seat_array: [], /** Chèn phần tử mới vào mảng `seat_array`*/
            }
        }

        rooms.forEach(room => {
            const randomNumber = Math.floor(Math.random() * 7) + 1;
            for (let i = 0; i < randomNumber; i++) {

                const randomTime = showtimeAraay[Math.floor(Math.random() * showtimeAraay.length)];
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];


                const showtimeExist = showtimeRoom[room.theater_id][randomTime].some(
                    (show) => show.movie_id === randomMovie.id
                );

                if (!showtimeExist) {
                    showtimeRoom[room.theater_id][randomTime].push(createShowtime(room.id, randomMovie.id, nextDate.format("YYYY-MM-DD"), randomTime));
                }

            }
        })

        const allShowtimes = Object.values(showtimeRoom).flatMap(roomSchedule => {
            return Object.values(roomSchedule).flat();
        });

        return await this.showtimeRepository.insertMany(allShowtimes);
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        const currentDate = moment();

        const nextDate = moment().add(4, 'days');

        const query = {
            time: {
                $gte: currentDate.format("YYYY-MM-DD"),
                $lte: nextDate.format("YYYY-MM-DD")
            }
        };

        const showtimes = await this.showtimeRepository.find(query).exec();

        const currentTime = new Date();

        const filteredShowtimes = showtimes.map(item => {
            const filteredSeats = item.seat_array.filter(seat => {
                return ((currentTime.getTime() - new Date(seat.time_order).getTime()) >= 0 && seat.status === SeatStatus.PENDING);
            });

            return { id: item.id, seat_numbers: filteredSeats.map(seat => seat.seat_number) }
        });

        const operations: any[] = filteredShowtimes.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: {
                    $pull: {
                        seat_array: {
                            seat_number: { $in: item.seat_numbers }
                        }
                    }
                }
            }
        }));

        await this.showtimeRepository.bulkWrite(operations);
    }
}
