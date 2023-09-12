import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Room } from './room.entity/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class RoomService extends BaseService<Room> {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {
        super(roomRepository);
    }

}
