import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'seats' })
export class Seat extends Document {
    @Prop()
    room_id: string;

    @Prop()
    seat_number: string;

    @Prop()
    type: number;

    @Prop()
    time: string;

    @Prop([{
        status: Number,
        time: String,
    }])
    showtimes: { status: number, time: string }[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);

SeatSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});