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
    point_history: string;

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
