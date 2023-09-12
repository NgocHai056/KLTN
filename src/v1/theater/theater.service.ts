import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Theater } from './theater.entity/theater.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";


@Injectable()
export class TheaterService extends BaseService<Theater> {
    constructor(
        @InjectRepository(Theater)
        private readonly theaterRepository: Repository<Theater>
    ) {
        super(theaterRepository)
    }
}
