import { Exclude } from 'class-transformer';
import { Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Unique(['email'])
    @Column({ default: "" })
    email: string;

    @Unique(['phone'])
    @Column({ default: "" })
    phone: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    access_token: string;

    @Column()
    refresh_token: string;

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