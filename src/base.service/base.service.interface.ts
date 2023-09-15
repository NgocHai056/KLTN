import { EntityId } from 'typeorm/repository/EntityId'

export interface IBaseService<T> {

    findAll(opts?): Promise<T[]>;

    create(data: any): Promise<T>;

    findOne(id: EntityId): Promise<T>

    update(id: EntityId, data: any): Promise<T>;

    findBy(where: any): Promise<T[]>;
}