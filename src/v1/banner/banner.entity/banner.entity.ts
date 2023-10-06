import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'banners' })
export class Banner extends Document {
    @Prop()
    title: string;

    @Prop()
    file: string;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

BannerSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});