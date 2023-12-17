import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { IsInt, IsNotEmptyString } from "src/utils.common/utils.decorator.common/utils.decorator.common";

export class BookingStatisticDto {

    @ApiProperty({
        required: false,
        example: "652410071da9eba4f2dd83ca",
        description: "Id rạp chiếu phim"
    })
    @IsNotEmptyString()
    @IsOptional()
    theater_id: string;

    @ApiProperty({
        required: false,
        example: "652a1a14464026525552677c",
        description: "Id của phòng chiếu phim"
    })
    @IsNotEmptyString()
    @IsOptional()
    room_id: string;

    @ApiProperty({
        required: false,
        example: "65260f822f91993c64422e07",
        description: "Id phim"
    })
    @IsNotEmptyString()
    @IsOptional()
    movie_id: string;


    @ApiProperty({
        default: "",
        example: "1997-10-20",
    })
    @IsDateString()
    readonly time: string = '';

    @ApiProperty({
        default: 1,
        example: 1,
        description: "1: Xem theo ngày, 2: Xem theo tháng, 3: Xem theo năm."
    })
    @IsInt()
    readonly report_type: number = 1;
}

