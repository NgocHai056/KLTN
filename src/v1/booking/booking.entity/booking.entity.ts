import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    movie_id: number;

    @Column()
    room_id: number;

    @Column()
    seat_id: number;

    @Column()
    time: Date;

    @Column()
    payment_status: number;

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    total_amount: number;

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