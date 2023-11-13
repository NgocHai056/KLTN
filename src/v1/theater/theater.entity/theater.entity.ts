import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'theaters' })
export class Theater extends Document {
    @Prop()
    name: string;

    @Prop({ default: '' })
    address: string;

    @Prop({ type: Number, default: 1 })
    status: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);

TheaterSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});