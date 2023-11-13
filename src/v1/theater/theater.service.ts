import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Theater } from './theater.entity/theater.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class TheaterService extends BaseService<Theater> {
    constructor(@InjectModel(Theater.name) private readonly theaterRepository: Model<Theater>) {
        super(theaterRepository);
    }

    async checkExisting(id: string): Promise<Theater> {
        const objectId = await this.validateObjectId(id, "TheaterID");
        const theater = await this.theaterRepository.findById(objectId).exec();

        if (!theater) {
            UtilsExceptionMessageCommon.showMessageError("Cinemas do not exist!");
        }
        return theater;
    }
}
