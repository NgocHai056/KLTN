import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bookings' })
export class Booking extends Document {

    @Prop()
    theater_name: string;

    @Prop()
    user_id: string;

    @Prop()
    user_name: string;

    @Prop()
    movie_name: string;

    @Prop()
    room_id: string;

    @Prop()
    room_number: string;

    @Prop()
    seat_number: string;

    @Prop()
    time: string;

    @Prop()
    showtime: string;

    @Prop()
    payment_method: number;

    @Prop()
    payment_status: number;

    @Prop()
    type: number;

    @Prop({ type: Number, default: 0 })
    total_amount: number;

    @Prop()
    expireAt: Date;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});