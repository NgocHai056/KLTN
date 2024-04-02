import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "exchange_points" })
export class ExchangePoint extends Document {
    @Prop()
    user_id: string;

    @Prop()
    theater_name: string;

    @Prop()
    movie_id: string;

    @Prop()
    point_history_name: string;

    @Prop([
        {
            seat_number: String,
            seat_type: Number,
            price: Number,
        },
    ])
    seats: { seat_number: string; seat_type: number; price: number }[];

    @Prop([
        {
            name: String,
            description: String,
            price: Number,
            quantity: Number,
            exchange_point: Number,
        },
    ])
    combos: {
        name: string;
        description: string;
        price: number;
        quantity: number;
        exchange_point: number;
    }[];

    @Prop()
    used_point: number;

    @Prop({ required: true, expires: "10m" })
    expireAt: Date;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const ExchangePointSchema = SchemaFactory.createForClass(ExchangePoint);

ExchangePointSchema.pre("findOneAndUpdate", function () {
    this.set({ updated_at: new Date() });
});
