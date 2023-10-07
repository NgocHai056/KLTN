import { Review } from "../review.entity/review.entity";

export class ReviewBuilder {
    private readonly review: Partial<Review>;

    constructor() {
        this.review = {};
    }

    withMovieId(movieId: string): this {
        this.review.movie_id = movieId;
        return this;
    }

    withUserId(userId: string): this {
        this.review.user_id = userId;
        return this;
    }

    withRating(rating: number): this {
        this.review.rating = rating;
        return this;
    }

    withReviewText(review: string): this {
        this.review.review = review;
        return this;
    }

    build(): Partial<Review> {
        return this.review;
    }
}
