import { SetMetadata } from "@nestjs/common/decorators";

export enum Role {
    USER = 0,
    MANAGER = 1,
    ADMIN = 2,
}


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);