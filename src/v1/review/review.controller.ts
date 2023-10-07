import {
    Controller,
    Get,
    HttpStatus,
    Res,
    UsePipes,
    ValidationPipe,
    Post,
    Body,
    Query,
    ParseIntPipe,
    Param
} from "@nestjs/common";

import { Response } from "express";
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";

import { ReviewService } from './review.service';
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";
import { MovieService } from "../movie/movie.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ReviewDto } from "./review.dto/review.dto";
import { Review } from "./review.entity/review.entity";
import { BookingService } from "../booking/booking.service";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity/user.entity";
import { ReviewResponse } from "./review.response/review.response";
import { ReviewBuilder } from "./review.builder/review.builder";

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/review' })
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly movieService: MovieService,
        private readonly bookingService: BookingService,
        private readonly userService: UserService
    ) { }

    @Post("")
    @Roles(Role.User)
    @ApiOperation({ summary: "API đánh giá cho từng bộ phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @GetUser() user: UserModel,
        @Body() reviewDto: ReviewDto,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        if ((await this.bookingService.findBy({ user_id: user.id, movie_id: reviewDto.movie_id })).length < 1) {
            UtilsExceptionMessageCommon.showMessageError("Bạn chưa xem phim này nên không thể đánh giá!");
        }

        let movie = await this.movieService.find(reviewDto.movie_id);

        if (!movie) {
            UtilsExceptionMessageCommon.showMessageError("Phim cần đánh giá không tồn tại!");
        }

        /** Calculate the average rating and update rating in the movie */
        let countReview = (await this.reviewService.findByCondition({ movie_id: reviewDto.movie_id })).length;
        movie.rating = ((movie.rating * countReview) + reviewDto.rating) / (countReview + 1);

        await this.movieService.update(movie.id, movie);

        const reviewBuilder = new ReviewBuilder()
            .withMovieId(reviewDto.movie_id)
            .withUserId(user.id)
            .withRating(reviewDto.rating)
            .withReviewText(reviewDto.review)
            .build();

        response.setData(await this.reviewService.create(reviewBuilder));
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/movie")
    @ApiOperation({ summary: "API lấy các đánh giá theo mỗi bộ phim" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getByMovieId(
        @Param("id", ParseIntPipe) id: number,
        @Res() res: Response
    ): Promise<any> {
        let response: ResponseData = new ResponseData();

        let reviews = new ReviewResponse().mapToList(await this.reviewService.findBy({ movie_id: id }));

        /** Get list id of user and then map user_name to reviews base on user_id of review */
        let userIds = reviews.map(review => review.user_id);
        let users = await this.userService.findByIds(userIds);

        const usersMap: { [userId: number]: User } = {};

        users.map(user => usersMap[user.id] = user);

        reviews.map(
            review => {
                const user = usersMap[review.user_id];
                review.user_name = user.name
            }
        )

        response.setData(reviews);
        return res.status(HttpStatus.OK).send(response);
    }
}
