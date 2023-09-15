import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "seats" })
export class Seat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_id: number;

    @Column()
    seat_number: string;

    @Column()
    type: number;

    @Column()
    showtimes: string;

    @Column()
    time: Date;

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