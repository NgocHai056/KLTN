import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Room } from './room.entity/room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class RoomService extends BaseService<Room> {
    constructor(@InjectModel(Room.name) private readonly roomRepository: Model<Room>) {
        super(roomRepository);
    }

    async checkExisting(id: string): Promise<Room> {
        const objectId = await this.validateObjectId(id, "RoomID");
        const room = await this.roomRepository.findById(objectId).exec();

        if (!room) {
            UtilsExceptionMessageCommon.showMessageError("Rooms do not exist!");
        }
        return room;
    }

    async checkExistRoomAndTheater(id: string, theaterId: string): Promise<Room> {
        const room = await this.findByCondition({ _id: id, theater_id: theaterId });

        if (room.length === 0) {
            UtilsExceptionMessageCommon.showMessageError("Rooms do not exist!");
        }
        return room.pop();
    }

    async getRoomsByTheaterId(theaterId: string) {
        return await this.roomRepository.find({ theater_id: theaterId }).exec();
    }
}
