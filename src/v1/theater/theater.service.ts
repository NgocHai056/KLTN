import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Theater } from './theater.entity/theater.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TheaterService extends BaseService<Theater> {
    constructor(@InjectModel(Theater.name) private readonly theaterRepository: Model<Theater>) {
        super(theaterRepository);
    }
}
