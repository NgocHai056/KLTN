import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Seat } from './seat.entity/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class SeatService extends BaseService<Seat>{
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>
    ) {
        super(seatRepository)
    }
}
