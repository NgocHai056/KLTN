import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "../utils.enum/role.enum";
import { NextFunction, Request, Response } from "express";
import { ExceptionResponseDetail } from "../utils.exception.common/utils.exception.common";
import { JwtTokenInterFace } from "../utils.jwt-token.common/utils.jwt-token.interface.common";
import { JwtToken } from "../utils.jwt-token.common/utils.jwt-token.common";
import { ExceptionStoreProcedure } from "../utils.exception.common/utils.store-procedure-exception.common";
import { UserService } from "src/v1/user/user.service";
import { User } from "src/v1/user/user.entity/user.entity";

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

        return true;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        let bearerToken: string = req.headers.authorization;

        if (!bearerToken || bearerToken === "") {
            throw new HttpException(
                new ExceptionResponseDetail(
                    HttpStatus.BAD_REQUEST,
                    "Kiểm tra lại xem bạn đã truyền token vào chưa!"
                ),
                HttpStatus.OK
            );
        }

        let decodeBearerTokenInterFace: JwtTokenInterFace = await new JwtToken().verifyBearerToken(bearerToken, process.env.ACCESS_TOKEN_SECRET);

        let user: User = await this.userService.findOne(
            decodeBearerTokenInterFace.user_id
        );

        ExceptionStoreProcedure.validate(user);

        if (user.access_token !== decodeBearerTokenInterFace.jwt_token) {
            throw new HttpException(
                new ExceptionResponseDetail(
                    HttpStatus.UNAUTHORIZED,
                    "Không có quyền truy cập"
                ),
                HttpStatus.UNAUTHORIZED
            );
        }

        next();
    }

}