import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OTP extends Document {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, expires: '5m' })
    expireAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
