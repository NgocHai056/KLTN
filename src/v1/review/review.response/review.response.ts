import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { Review } from "../review.entity/review.entity";

export class ReviewResponse {
    @ApiProperty({
        example: "65260f822f91993c64422e07",
        description: "",
    })
    user_id: string;

    @ApiProperty({
        example: "Happy coding!",
        description: "",
    })
    user_name: string;

    @Column({ type: "decimal", precision: 4, scale: 2 })
    rating: number;

    @ApiProperty({
        example: "Happy coding!",
        description: "",
    })
    review: string;

    constructor(entity?: Review) {
        this.user_id = entity ? entity.user_id : "";
        this.rating = entity ? entity.rating : 0;
        this.review = entity ? entity.review : "";
    }

    public mapToList(entities: Review[]): ReviewResponse[] {
        const data: ReviewResponse[] = [];
        entities.forEach((e) => {
            data.push(new ReviewResponse(e));
        });
        return data;
    }
}
