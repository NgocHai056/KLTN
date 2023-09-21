import { SetMetadata } from "@nestjs/common/decorators";

export enum Role {
    User = 0,
    Admin = 1,
}


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);