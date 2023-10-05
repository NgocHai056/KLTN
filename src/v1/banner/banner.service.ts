import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base.service/base.service';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './banner.entity/user.entity';

@Injectable()
export class BannerService extends BaseService<Banner>{
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>
    ) {
        super(bannerRepository);
    }
}
