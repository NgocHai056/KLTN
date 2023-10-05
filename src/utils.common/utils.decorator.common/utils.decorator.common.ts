import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { ExceptionResponseDetail } from "../utils.exception.common/utils.exception.common";
import { UtilsExceptionMessageCommon } from "../utils.exception.common/utils.exception.message.common";

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      UtilsExceptionMessageCommon.showMessageError("Invalid token!");
    }

    return request.user;
  }
);

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isNotEmptyString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] cannot be empty.`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isNotEmpty",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          typeof value === "string" && value.trim().length > 0,
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] cannot be empty.`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsInt(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isInt",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          if (value === '') {
            return false;
          }
          return !isNaN(value) || Number.isInteger(value);
        },

        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] must be an integer!`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function MaxLength20(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "maxLength20",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => !(value.length > 20) || !value,
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] cannot exceed 20 characters in ${propertyName}!`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function IsEmptyArray(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "isNotArray",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => !(value.length == 0),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] cannot be empty!`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}

export function Min(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "Min",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          (!isNaN(value) || Number.isInteger(value)) && (value > 0),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] Must be an integer and greater than 0!`
            ),
            HttpStatus.OK
          );
        },
      },
    });
  };
}
