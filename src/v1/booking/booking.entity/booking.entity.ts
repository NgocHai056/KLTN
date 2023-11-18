import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bookings' })
export class Booking extends Document {

    @Prop()
    theater_name: string;

    @Prop()
    theater_id: string;

    @Prop()
    user_id: string;

    @Prop()
    email: string;

    @Prop()
    user_name: string;

    @Prop()
    movie_id: string;

    @Prop()
    movie_name: string;

    @Prop()
    format: string;

    @Prop()
    room_id: string;

    @Prop()
    room_number: string;

    @Prop([{
        seat_number: String,
        seat_type: Number,
        price: Number
    }])
    seats: { seat_number: string, seat_type: number, price: number }[];

    @Prop([{
        name: String,
        description: String,
        price: Number,
        quantity: Number
    }])
    combos: { name: string, description: string, price: number, quantity: number }[];

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

    @Prop({ required: true, expires: '10m' })
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