import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "ticket_prices" })
export class TicketPrice extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    type: number;

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