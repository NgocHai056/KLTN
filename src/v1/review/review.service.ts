import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Review } from './review.entity/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class ReviewService extends BaseService<Review> {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {
        super(reviewRepository);
    }
}