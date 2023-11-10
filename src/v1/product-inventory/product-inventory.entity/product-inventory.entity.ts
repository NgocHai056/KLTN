import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'inventory-products' })
export class ProductInventory extends Document {

    @Prop()
    theater_id: string;

    @Prop()
    product_id: string;

    @Prop()
    stock_quantity: number;

    @Prop()
    price: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const ProductInventorySchema = SchemaFactory.createForClass(ProductInventory);

ProductInventorySchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});