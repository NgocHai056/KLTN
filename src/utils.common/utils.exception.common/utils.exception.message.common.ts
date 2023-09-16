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
}
