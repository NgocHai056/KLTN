import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Showtime } from './showtime.entity/showtime.entity';

@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
    constructor(
        @InjectRepository(Showtime)
        private readonly showtimeRepository: Repository<Showtime>
    ) {
        super(showtimeRepository);
    }
}
