import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "../utils.enum/role.enum";
import { NextFunction, Request, Response } from "express";
import { JwtTokenInterFace } from "../utils.jwt-token.common/utils.jwt-token.interface.common";
import { JwtToken } from "../utils.jwt-token.common/utils.jwt-token.common";
import { ExceptionStoreProcedure } from "../utils.exception.common/utils.store-procedure-exception.common";
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

            if (privilege === Role.Admin) {
                return true;
            } else if (!requiredRoles.some((role) => privilege === role)) {
                UtilsExceptionMessageCommon.showMessageError("Bạn không có quyền truy cập vào chức năng này!");
            }
        }

        return true;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        let bearerToken: string = req.headers.authorization;

        if (!bearerToken || bearerToken === "") {
            UtilsExceptionMessageCommon.showMessageError("Kiểm tra lại xem bạn đã truyền token vào chưa!");
        }

        let decodeBearerTokenInterFace: JwtTokenInterFace = await new JwtToken().verifyBearerToken(bearerToken, process.env.ACCESS_TOKEN_SECRET);

        let user: User = await this.userService.findOne(
            decodeBearerTokenInterFace.user_id
        );

        ExceptionStoreProcedure.validate(user);

        if (user.access_token !== decodeBearerTokenInterFace.jwt_token) {
            UtilsExceptionMessageCommon.showMessageError("Không có quyền truy cập");
        }

        req.user = new UserModel(user);

        next();
    }

}