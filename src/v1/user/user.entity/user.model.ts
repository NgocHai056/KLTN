import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export class UserModel {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({ default: "" })
    email: string;

    @Column({ default: "" })
    phone: string;

    @Column()
    role: number;

    @Column()
    access_token: string;

    @Column()
    refresh_token: string;

    constructor(entity?: User) {
        this.id = entity ? entity.id : 0;
        this.name = entity ? entity.name : "";
        this.phone = entity ? entity.phone : "";
        this.email = entity ? entity.email : "";
        this.role = entity ? entity.role : 0;
        this.access_token = entity ? entity.access_token : "";
        this.refresh_token = entity ? entity.refresh_token : "";
    }
}