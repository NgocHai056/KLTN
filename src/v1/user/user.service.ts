import { Injectable } from '@nestjs/common';
import { User } from './user.entity/user.entity';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service/base.service';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Injectable()
export class UserService extends BaseService<User>{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }

    async checkExisting(email: string): Promise<any> {
        const user = await this.userRepository.findBy({ email: email });

        if (user.length !== 0) {
            UtilsExceptionMessageCommon.showMessageError("This account has already existed.");
        }

        return user;
    }
}
