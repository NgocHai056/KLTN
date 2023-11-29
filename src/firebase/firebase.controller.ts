import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from "express";
import { FirebaseService } from './firebase.service';
import { BannerDto } from 'src/v1/banner/banner.dto/banner.dto';
import { UtilsExceptionMessageCommon } from 'src/utils.common/utils.exception.common/utils.exception.message.common';

@Controller('firebase')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }


}