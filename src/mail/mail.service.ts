import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as QRCode from "qrcode";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmation(
        email: string,
        subject: string,
        template: string,
        context: any,
    ) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: subject,
            template: template, // `.hbs` extension is appended automatically
            context: context,
        });
    }

    async sendEmailWithQRCode(
        email: string,
        subject: string,
        template: string,
        context: any,
        bookingId: string,
    ) {
        // Tạo file ảnh mã QR code
        const qrCodePath = path.join(__dirname, "qrcode.png");

        await QRCode.toFile(
            qrCodePath,
            `https://nh-cinema.vercel.app/ticket-information/${bookingId}`,
            {
                errorCorrectionLevel: "H",
            },
        );

        // Gửi email với tệp đính kèm là mã QR code
        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            template: template, // `.hbs` extension is appended automatically
            context: context,
            attachments: [
                {
                    filename: "qrcode.png",
                    path: qrCodePath,
                    cid: "logo",
                },
            ],
        });

        // Xóa file ảnh sau khi gửi email
        fs.unlinkSync(qrCodePath);
    }
}
