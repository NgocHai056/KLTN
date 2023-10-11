import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'movies' })
export class Movie extends Document {
    @Prop()
    name: string;

    @Prop()
    english_name: string;

    @Prop()
    genres: string[];

    @Prop()
    format: string;

    @Prop()
    age: string;

    @Prop()
    title: string;

    @Prop()
    release: Date;

    @Prop()
    duration: string;

    @Prop()
    director: string;

    @Prop()
    performer: string;

    @Prop()
    description: string;

    @Prop()
    poster: string;

    @Prop()
    thumbnail: string;

    @Prop()
    trailer: string;

    @Prop({ type: Number, default: 0 })
    rating: number;

    @Prop({ type: Number, default: 1 })
    status: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});