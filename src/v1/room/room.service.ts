import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Room } from './room.entity/room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoomService extends BaseService<Room> {
    constructor(@InjectModel(Room.name) private readonly roomRepository: Model<Room>) {
        super(roomRepository);
    }

}
