import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionResponseDetail } from "../utils.exception.common/utils.exception.common";
import { JwtTokenInterFace } from "./utils.jwt-token.interface.common";
import * as jwt from "jsonwebtoken";
import { UtilsExceptionMessageCommon } from "../utils.exception.common/utils.exception.message.common";

export class JwtToken {

    /**
     * Using the @nestjs/jwt library, which supplies a signAsync() function to generate our JWT from a subset of the user object properties
     * 
     * @param payload 
     * @param secretSignature 
     * @param tokenLife 
     * @returns return as a simple object with a single access_token property.
     */
    public async generateToken(payload: any, secretSignature: string, tokenLife: string) {

        return await jwt.sign(
            payload,
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            },
        );
    }

    /**
     *
     * @param token
     * @param secretKey
     * @returns
     */
    public verifyBearerToken = async (
        bearerToken: string, secretSignature: string
    ): Promise<JwtTokenInterFace> => {
        let decodeBearerTokenInterFace: JwtTokenInterFace;

        let token: string = await this.splitBearerToken(bearerToken);
        try {
            decodeBearerTokenInterFace = Object(await jwt.verify(token, secretSignature));
        } catch (error) {
            UtilsExceptionMessageCommon.showMessageErrorAndStatus(error.message, HttpStatus.UNAUTHORIZED);
        }
        if (!decodeBearerTokenInterFace) {
            UtilsExceptionMessageCommon.showMessageError("Invalid Token!");
        }
        decodeBearerTokenInterFace.jwt_token = token;

        return decodeBearerTokenInterFace;
    };

    /**
     * Decode token without check expiration to verify access token have valid 
     * when create new access token base on refresh token
     * 
     * @param bearerToken 
     * @param secretSignature 
     * @param tokenLife 
     * @returns 
     */
    public decodeToken = async (
        bearerToken: string, secretSignature: string
    ): Promise<JwtTokenInterFace> => {

        let decodeBearerTokenInterFace: JwtTokenInterFace;

        let token: string = await this.splitBearerToken(bearerToken);
        try {
            decodeBearerTokenInterFace = Object(await jwt.verify(token, secretSignature, { ignoreExpiration: true }));
        } catch (error) {
            UtilsExceptionMessageCommon.showMessageError(error.message);
        }

        decodeBearerTokenInterFace.jwt_token = token;

        return decodeBearerTokenInterFace;
    };

    /**
     * 
     * @param token 
     * @returns 
     */
    splitBearerToken = (token: string): string => {
        let splitToken: string;

        if (!token || token === "") {
            UtilsExceptionMessageCommon.showMessageError("Invalid Token!");
        }

        splitToken = token.split(" ")[1];

        if (!splitToken || splitToken === "") {
            UtilsExceptionMessageCommon.showMessageError("Invalid Token!");
        }

        return splitToken;
    };
}
