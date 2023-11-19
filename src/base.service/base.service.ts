import { Model, Document } from 'mongoose';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

export default abstract class BaseService<T extends Document> {
    constructor(private readonly model: Model<T>) { }

    async create(createDto: any): Promise<T> {
        const createdItem = new this.model(createDto);
        return await createdItem.save();
    }

    async find(id: string): Promise<T> {
        const objectId = await this.validateObjectId(id, "ID");

        return await this.model.findById(objectId).exec();
    }

    async findByIds(ids: string[]): Promise<T[]> {
        const promises = ids.map(async id => {
            await this.validateObjectId(id, "ID");
        });

        await Promise.all(promises);

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

    async updateMany(condition: any, updateDto: any) {
        const updateResult = await this.model.updateMany(condition, updateDto, { new: true }).exec();

        return updateResult.modifiedCount > 0;
    }

    async delete(id: string): Promise<T> {
        return await this.model.findByIdAndRemove(id).exec();
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        return (await this.model.deleteMany({ _id: { $in: ids } }).exec()).deletedCount > 0;
    }

    protected async validateObjectId(id: string, msg: string) {
        if (typeof (id) !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {

            UtilsExceptionMessageCommon.showMessageError(`Invalid ${msg}`);
        }
        return id;
    }
}
