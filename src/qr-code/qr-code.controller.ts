import { Controller } from "@nestjs/common";
import { QrCodeService } from "./qr-code.service";

@Controller("qr-code")
export class QrCodeController {
    constructor(private readonly qrCodeService: QrCodeService) {}
}
