import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ticket_prices' })
export class TicketPrice extends Document {

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, required: true })
    type: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const TicketPriceSchema = SchemaFactory.createForClass(TicketPrice);

TicketPriceSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});