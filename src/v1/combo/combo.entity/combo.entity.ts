import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'combos' })
export class Combo extends Document {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop([{
        product_id: String,
        quantity: Number
    }])
    combo_items: { product_id: string, quantity: number }[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const ComboSchema = SchemaFactory.createForClass(Combo);

ComboSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});