import { Injectable } from "@nestjs/common";
import BaseService from "src/base.service/base.service";
import { Notification } from "./entities/notification.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class NotificationService extends BaseService<Notification> {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
    ) {
        super(notificationModel);
    }
}
