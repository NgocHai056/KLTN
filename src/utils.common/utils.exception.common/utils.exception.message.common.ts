import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionResponseDetail } from "./utils.exception.common";

export class UtilsExceptionMessageCommon {
    public static showMessageError(msg: string) {
        throw new HttpException(
            new ExceptionResponseDetail(
                HttpStatus.BAD_REQUEST,
                msg
            ),
            HttpStatus.OK
        );
    }

    public static showMessageErrorAndStatus(msg: string, httpStatus: HttpStatus) {
        throw new HttpException(
            new ExceptionResponseDetail(
                httpStatus,
                msg
            ),
            HttpStatus.OK
        );
    }
}
