import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "showtimes" })
export class Showtime extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_id: number;

    @Column()
    time: Date;

    @Column()
    status: string;

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