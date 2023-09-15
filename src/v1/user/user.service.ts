import { Injectable } from '@nestjs/common';
import { User } from './user.entity/user.entity';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service/base.service';

@Injectable()
export class UserService extends BaseService<User>{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }
}
