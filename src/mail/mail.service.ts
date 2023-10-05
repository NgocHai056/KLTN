import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/v1/user/user.dto/user.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: UserDto, subject: string, template: string, context: any) {
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: subject,
            template: template, // `.hbs` extension is appended automatically
            context: context,
        });
    }
}
