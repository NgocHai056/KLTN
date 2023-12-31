import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "../utils.enum/role.enum";
import { NextFunction, Request, Response } from "express";
import { JwtTokenInterFace } from "../utils.jwt-token.common/utils.jwt-token.interface.common";
import { JwtToken } from "../utils.jwt-token.common/utils.jwt-token.common";
import { UserService } from "src/v1/user/user.service";
import { User } from "src/v1/user/user.entity/user.entity";
import { UtilsExceptionMessageCommon } from "../utils.exception.common/utils.exception.message.common";
import { UserModel } from "src/v1/user/user.entity/user.model";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware, CanActivate {

    constructor(
        private userService: UserService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),

        ]);

        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if (user instanceof UserModel) {
            const privilege: number = user.role;

            if (privilege === Role.ADMIN) {
                return true;
            } else if (!requiredRoles.some((role) => privilege === role)) {
                UtilsExceptionMessageCommon.showMessageError("You do not have access to this functionality!");
            }
        }

        return true;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        let bearerToken: string = req.headers.authorization;

        if (!bearerToken || bearerToken === "") {
            UtilsExceptionMessageCommon.showMessageError("Check to see if you have passed the token!");
        }

        let decodeBearerTokenInterFace: JwtTokenInterFace = await new JwtToken().verifyBearerToken(bearerToken, process.env.ACCESS_TOKEN_SECRET);

        let user: User = await this.userService.find(
            decodeBearerTokenInterFace.user_id
        );

        if (user.access_token !== decodeBearerTokenInterFace.jwt_token) {
            UtilsExceptionMessageCommon.showMessageErrorAndStatus("Token is incorrect.", HttpStatus.UNAUTHORIZED);
        }

        req.user = new UserModel(user);

        next();
    }

}