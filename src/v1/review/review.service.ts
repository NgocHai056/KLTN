import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Review } from './review.entity/review.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReviewService extends BaseService<Review> {
    constructor(@InjectModel(Review.name) private readonly reviewRepository: Model<Review>) {
        super(reviewRepository);
    }
}