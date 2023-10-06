import { Model, Document } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

export default abstract class BaseService<T extends Document> {
    constructor(private readonly model: Model<T>) { }

    async create(createDto: any): Promise<T> {
        const createdItem = new this.model(createDto);
        return await createdItem.save();
    }

    async find(id: string): Promise<T> {
        const objectId = this.validateObjectId(id);

        return await this.model.findById(objectId).exec();
    }

    async findByIds(ids: string[]): Promise<T[]> {
        return await this.model.find({ _id: { $in: ids } }).exec();
    }

    async findByCondition(condition: any): Promise<T[]> {
        const data = await this.model.find(condition).exec();
        return data;
    }

    async findAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async update(id: string, updateDto: any): Promise<T> {
        return await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    }

    async delete(id: string): Promise<T> {
        return await this.model.findByIdAndRemove(id).exec();
    }

    private validateObjectId(id: string): string {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            UtilsExceptionMessageCommon.showMessageError("'Invalid ID'");
        }
        return id;
    }
}
