import { BaseEntity, DeleteResult, Repository } from 'typeorm'
import { EntityId } from 'typeorm/repository/EntityId'
import { IBaseService } from './base.service.interface'

export class BaseService<T extends BaseEntity> implements IBaseService<T> {

    constructor(private readonly repository: Repository<T>) { }

    async create(data: any): Promise<T> {
        return this.repository.save(data)
    }

    async findOne(id: EntityId): Promise<T> {
        return this.repository.findOneById(id)
    }

    async update(id: EntityId, data: any): Promise<T> {
        await this.repository.update(id, data)
        return this.findOne(id)
    }

}
