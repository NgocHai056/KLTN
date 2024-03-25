import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "users" })
export class User extends Document {
    @Prop()
    name: string;

    @Prop({ unique: true, default: "" })
    email: string;

    @Prop({ unique: true, default: "" })
    phone: string;

    @Prop()
    password: string;

    @Prop()
    date_of_birth: string;

    @Prop()
    gender: string;

    @Prop({ default: 0 })
    role: number;

    @Prop()
    theater_id: string;

    @Prop()
    access_token: string;

    @Prop()
    refresh_token: string;

    @Prop()
    status: number;

    @Prop({ expires: "10m" })
    expireAt: Date;

    @Prop({ default: () => new Date() })
    created_at: Date;

    @Prop({ default: () => new Date() })
    updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("findOneAndUpdate", function () {
    this.set({ updated_at: new Date() });
});
