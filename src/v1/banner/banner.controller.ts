import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { VersionEnum } from "src/utils.common/utils.enum/utils.version.enum";
import { UtilsExceptionMessageCommon } from "src/utils.common/utils.exception.common/utils.exception.message.common";
import { ResponseData } from "src/utils.common/utils.response.common/utils.response.common";
import { BannerDto } from "./banner.dto/banner.dto";
import { BannerService } from "./banner.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";

@Controller({ version: VersionEnum.V1.toString(), path: "unauth/banner" })
export class BannerController {
    constructor(
        private bannerService: BannerService,
        private firebaseService: FirebaseService,
    ) {}

    @Post()
    @ApiOperation({ summary: "API create banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FileInterceptor("image"))
    async create(
        @UploadedFile() file,
        @Body() bannerDto: BannerDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        if (!file)
            UtilsExceptionMessageCommon.showMessageError("Image is required.");

        const imageUrl = await this.firebaseService.uploadImageToFirebase(file);

        response.setData(
            await this.bannerService.create({
                title: bannerDto.title,
                file: imageUrl,
            }),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @ApiOperation({ summary: "API update banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FileInterceptor("image"))
    async update(
        @Param("id") id: string,
        @UploadedFile() file,
        @Body() bannerDto: BannerDto,
        @Res() res: Response,
    ) {
        const response: ResponseData = new ResponseData();

        const banner = await this.bannerService.find(id);

        if (!banner)
            UtilsExceptionMessageCommon.showMessageError("Banner not exist.");

        if (!file) {
            response.setData(
                await this.bannerService.update(banner.id, {
                    title: bannerDto.title,
                }),
            );
            return res.status(HttpStatus.OK).send(response);
        }

        let imageUrl = banner.file;

        if (!banner.file.includes(file.originalname)) {
            await this.firebaseService.deleteFileFromFirebaseStorage(
                banner.file,
            );
            imageUrl = await this.firebaseService.uploadImageToFirebase(file);
        }

        response.setData(
            await this.bannerService.update(banner.id, {
                title: bannerDto.title,
                file: imageUrl,
            }),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/delete")
    @ApiOperation({ summary: "API delete banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Body() ids: string[], @Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(
            (await this.bannerService.deleteMany(ids))
                ? "Delete successful"
                : "Unsuccessful",
        );

        const banners = await this.bannerService.findByIds(ids);

        banners.forEach((banner) =>
            this.firebaseService.deleteFileFromFirebaseStorage(banner.file),
        );
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("")
    @ApiOperation({ summary: "API get list banner" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Res() res: Response) {
        const response: ResponseData = new ResponseData();

        response.setData(await this.bannerService.findAll());
        return res.status(HttpStatus.OK).send(response);
    }
}
