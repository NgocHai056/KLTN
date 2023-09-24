import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "movie_reviews" })
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    movie_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'decimal', precision: 4, scale: 2 })
    rating: number;

    @Column()
    review: string;

    @CreateDateColumn({
        default: `now()`,
        nullable: true,
    })
    created_at: Date;

    @UpdateDateColumn({
        default: `now()`,
        nullable: true,
    })
    updated_at: Date;

    constructor(movieId: number, userId: number, rating: number, review: string) {
        super();
        this.movie_id = movieId;
        this.user_id = userId;
        this.rating = rating;
        this.review = review;
    }
}