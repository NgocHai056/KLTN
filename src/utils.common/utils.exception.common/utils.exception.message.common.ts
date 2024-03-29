import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionResponseDetail } from "./utils.exception.common";

export class UtilsExceptionMessageCommon {
    public static showMessageError(msg: string): string {
        throw new HttpException(
            new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, msg),
            HttpStatus.BAD_REQUEST,
        );
    }

    public static showMessageErrorWithData(
        msg: string,
        data: object,
        httpStatus: HttpStatus,
    ): string {
        throw new HttpException(
            new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, msg, data),
            httpStatus,
        );
    }

    public static showMessageErrorAndStatus(
        msg: string,
        httpStatus: HttpStatus,
    ) {
        throw new HttpException(
            new ExceptionResponseDetail(httpStatus, msg),
            httpStatus,
        );
    }
}
