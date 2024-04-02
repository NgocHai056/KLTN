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
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UserModel } from "../user/user.entity/user.model";
import { GetUser } from "src/utils.common/utils.decorator.common/utils.decorator.common";
import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";

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

        const notification = await this.notificationService.findByCondition({
            user_id: user.id,
        });

        if (notification.length === 0)
            UtilsExceptionMessageCommon.showMessageError(
                "User haven't received any notification yet!",
            );

        response.setData(notification);

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
