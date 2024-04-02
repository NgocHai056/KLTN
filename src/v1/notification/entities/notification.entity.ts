import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "notifications" })
export class Notification extends Document {
    @Prop()
    user_id: string;

    @Prop()
    object_id: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    type: number;

    @Prop({ expires: "10m" })
    expireAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.pre("findOneAndUpdate", function () {
    this.set({ updated_at: new Date() });
});
