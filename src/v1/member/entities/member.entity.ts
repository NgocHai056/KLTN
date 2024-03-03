import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "member-points" })
export class Member extends Document {
    @Prop()
    user_id: string;

    @Prop()
    rating_point: number;

    @Prop()
    consumption_point: number;

    @Prop({ default: 1 })
    level: number;

    @Prop({ default: 0 })
    is_gift: number;

    @Prop([
        {
            name: String,
            used_point: Number,
            day_trading: Date,
        },
    ])
    point_history: { name: string; used_point: number; day_trading: Date }[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre("findOneAndUpdate", function () {
    this.set({ updated_at: new Date() });
});
