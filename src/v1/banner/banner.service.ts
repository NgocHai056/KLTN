import { Injectable } from '@nestjs/common';
import BaseService from 'src/base.service/base.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Banner } from './banner.entity/banner.entity';

@Injectable()
export class BannerService extends BaseService<Banner> {
    constructor(@InjectModel(Banner.name) private readonly bannerRepository: Model<Banner>) {
        super(bannerRepository);
    }
}
