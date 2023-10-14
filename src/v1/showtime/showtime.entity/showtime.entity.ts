import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'showtimes' })
export class Showtime extends Document {
    @Prop()
    room_id: string;

    @Prop()
    movie_id: string;

    @Prop()
    time: string;

    @Prop()
    showtime: string;

    @Prop([{
        seat_number: String,
        status: Number,
        seat_type: Number
    }])
    seat_array: { seat_number: string, status: number, seat_type: number }[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);

ShowtimeSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});