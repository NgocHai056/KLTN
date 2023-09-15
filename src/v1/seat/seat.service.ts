import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Seat } from './seat.entity/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { StoreProcedureOutputResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common';
import { StoreProcedureResultOutput } from 'src/utils.common/utils.store-procedure-result.common/utils-store-procedure-result-output-common';

@Injectable()
export class SeatService extends BaseService<Seat>{
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>
    ) {
        super(seatRepository)
    }
}
