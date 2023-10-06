import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'rooms' })
export class Room extends Document {
    @Prop()
    theater_id: string;

    @Prop()
    room_number: string;

    @Prop()
    seat_capacity: number;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.pre('findOneAndUpdate', function () {
    this.set({ updated_at: new Date() });
});