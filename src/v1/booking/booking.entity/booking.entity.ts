import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    seat_id: number;

    @Column()
    time: Date;

    @Column()
    payment_status: number;

    @Column()
    total_amount: Date;

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