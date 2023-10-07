import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'movie_reviews' })
export class Review extends Document {
    @Prop()
    movie_id: string;

    @Prop()
    user_id: string;

    @Prop({ type: Number, required: true })
    rating: number;

    @Prop({ required: true })
    review: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});