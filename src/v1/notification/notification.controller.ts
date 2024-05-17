import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Res,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { NotifyType } from "src/utils.common/utils.enum/notify.enum";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UserModel } from "../user/user.entity/user.model";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";

@Controller({ version: VersionEnum.V1.toString(), path: "auth/notification" })
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    @Get()
    findAll() {
        return this.notificationService.findAll();
    }

    @Get("/user")
    @ApiOperation({ summary: "API get notification by user." })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findByUser(@GetUser() user: UserModel, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        const notifyBooking = await this.notificationService.findByCondition({
            user_id: user.id,
            type: NotifyType.BOOKING,
        });

        // Get notify for movie from 20 days previous to now
        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 20);

        const notifyMovie = await this.notificationService.findByCondition({
            type: NotifyType.MOVIE,
            announcement_date: { $gte: previousDate, $lt: new Date() },
        });

        response.setData(
            [...notifyBooking, ...notifyMovie].sort(
                (a, b) => b.created_at.getTime() - a.created_at.getTime(),
            ),
        );

        return res.status(HttpStatus.OK).send(response);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        return this.notificationService.update(id, updateNotificationDto);
    }
}
