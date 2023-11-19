import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'products' })
export class Product extends Document {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop()
    type: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});