import { EntityId } from 'typeorm/repository/EntityId'

export interface IBaseService<T> {
    create(data: any): Promise<T>;

    findOne(id: EntityId): Promise<T>

    update(id: EntityId, data: any): Promise<T>;
}