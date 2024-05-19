import { Module } from "@nestjs/common";
import { QrCodeService } from "./qr-code.service";
import { QrCodeController } from "./qr-code.controller";
import { MailModule } from "src/mail/mail.module";

@Module({
    imports: [MailModule],
    providers: [QrCodeService],
    controllers: [QrCodeController],
})
export class QrCodeModule {}
