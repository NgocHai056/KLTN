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
import { StoreProcedureOutputResultInterface } from "src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common";

import { ReviewService } from './review.service';
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { UserModel } from "../user/user.entity/user.model";
import { MovieService } from "../movie/movie.service";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ReviewDto } from "./review.dto/review.dto";
import { Review } from "./review.entity/review.entity";
import { BookingService } from "../booking/booking.service";
import { Role, Roles } from "src/utils.common/utils.enum/role.enum";

@Controller({ version: VersionEnum.V1.toString(), path: 'review' })
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly movieService: MovieService,
        private readonly bookingService: BookingService
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

        let movie = await this.movieService.findOne(reviewDto.movie_id);

        if (!movie) {
            UtilsExceptionMessageCommon.showMessageError("Phim cần đánh giá không tồn tại!");
        }

        /** Calculate the average rating and update rating in the movie */
        let countReview = (await this.reviewService.findBy({ user_id: user.id })).length;
        movie.rating = ((movie.rating * countReview) + reviewDto.rating) / (countReview + 1);

        await this.movieService.update(movie.id, movie);

        response.setData(
            await this.reviewService.create(
                new Review(reviewDto.movie_id, user.id, reviewDto.rating, reviewDto.review)
            )
        );
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

        response.setData(await this.reviewService.findBy({ movie_id: id }));
        return res.status(HttpStatus.OK).send(response);
    }
}
