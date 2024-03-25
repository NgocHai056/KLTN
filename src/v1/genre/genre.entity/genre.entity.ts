import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "genres" })
export class Genre extends Document {
    @Prop()
    name: string;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    updated_at: Date;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

GenreSchema.pre("findOneAndUpdate", function () {
    this.set({ updated_at: new Date() });
});
