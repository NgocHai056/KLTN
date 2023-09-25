import { BaseEntity, DeleteResult, Repository } from 'typeorm'
import { EntityId } from 'typeorm/repository/EntityId'
import { IBaseService } from './base.service.interface'
import { StoreProcedureOutputResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-output-result.interface.common';
import { StoreProcedureResultOutput } from 'src/utils.common/utils.store-procedure-result.common/utils-store-procedure-result-output-common';

export class BaseService<T extends BaseEntity> implements IBaseService<T> {

    constructor(private readonly repository: Repository<T>) { }

    async findOne(id: EntityId): Promise<T> {
        return this.repository.findOneById(id);
    }

    async findBy(where: any): Promise<T[]> {
        const queryBuilder = this.repository.createQueryBuilder();
        return queryBuilder.where(where).getMany();
    }

    async findByIds(ids: any): Promise<T[]> {
        return this.repository.findByIds(ids);
    }

    async findAll(opts?): Promise<T[]> {
        return this.repository.find(opts);
    }

    async create(data: any): Promise<T> {
        return this.repository.save(data);
    }

    async update(id: EntityId, data: any): Promise<T> {
        await this.repository.update(id, data);
        return this.findOne(id);
    }

    async callStoredProcedure(query: string, params: any[]): Promise<StoreProcedureOutputResultInterface<T, any>> {
        let result = await this.repository.query(query, params);

        return new StoreProcedureResultOutput<T>().getResultOutputList(result);
    }
}
