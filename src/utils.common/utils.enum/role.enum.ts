import { SetMetadata } from "@nestjs/common/decorators";

export enum Role {
    OWNER = 'OWNER',
}


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);