import { Exclude } from 'class-transformer';
import { Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "movies" })
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    genre_id: number;

    @Column()
    title: string;

    @Column()
    release: Date;

    @Column()
    duration: string;

    @Column()
    director: string;

    @Column()
    performer: string;

    @Column()
    description: string;

    @Column()
    thumbnail: string;

    @Column()
    trailer: string;

    @Column({ type: 'decimal', precision: 4, scale: 2 })
    rating: number;

    @Column()
    status: number;

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
}