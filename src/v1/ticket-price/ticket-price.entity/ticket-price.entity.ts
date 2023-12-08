import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ticket_prices' })
export class TicketPrice extends Document {

    @Prop()
    day_of_week: number;

    @Prop()
    is_holiday: number;

    @Prop([{
        seat_type: Number,
        price: Number
    }])
    tickets: { seat_type: number, price: number }[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const TicketPriceSchema = SchemaFactory.createForClass(TicketPrice);

TicketPriceSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});