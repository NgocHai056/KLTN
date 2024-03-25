import { Controller, Get, HttpStatus, Query, Res } from "@nestjs/common";
import { QrCodeService } from "./qr-code.service";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { Response } from "express";

@Controller("qr-code")
export class QrCodeController {
    constructor(private readonly qrCodeService: QrCodeService) {}

    @Get()
    async generateQrCode(@Query("data") data: string, @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.qrCodeService.generateQrCode(data));

        return res.status(HttpStatus.OK).send(response);
    }
}
