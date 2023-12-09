import {
	createParamDecorator,
	ExecutionContext,
	HttpStatus
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {
	isEmail,
	isNotEmpty,
	isString,
	registerDecorator,
	validateSync,
	ValidationArguments,
	ValidationOptions
} from "class-validator";
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


/**
 * @decorator
 * @description A custom decorator to validate a validation-schema within a validation schema upload N levels
 * @param schema The validation Class
 */
export function ValidateNested(
	schema: new () => any,
	validationOptions?: ValidationOptions
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'ValidateNested',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {

					if (typeof value === 'undefined') {
						UtilsExceptionMessageCommon.showMessageError(`[${args.property}] should not be empty.`);
					}

					if (Array.isArray(value)) {
						for (let i = 0; i < (<Array<any>>value).length; i++) {
							if (validateSync(plainToClass(schema, value[i])).length) {
								return false;
							}
						}
						return true;
					} else
						return validateSync(plainToClass(schema, value)).length
							? false
							: true;
				},
				defaultMessage(args) {
					if (Array.isArray(args.value)) {
						for (let i = 0; i < (<Array<any>>args.value).length; i++) {
							return (
								`${args.property}::index${i} -> ` +
								validateSync(plainToClass(schema, args.value[i]))
									.map((e) => e.constraints)
									.reduce((acc, next) => acc.concat(Object.values(next)), [])
							).toString();
						}
					} else
						return (
							`${args.property}: ` +
							validateSync(plainToClass(schema, args.value))
								.map((e) => e.constraints)
								.reduce((acc, next) => acc.concat(Object.values(next)), [])
						).toString();
				},
			},
		});
	};
}

export function IsValidTimeFormat(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isValidTimeFormat',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: {
				validate(value: any): boolean {
					/** Kiểm tra định dạng thời gian */
					const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
					if (value.match(timeFormatRegex)) {
						/** Kiểm tra giới hạn thời gian từ 00:00 đến 23:59 */
						const [hours, minutes] = value.split(":");
						const hoursInt = parseInt(hours);
						const minutesInt = parseInt(minutes);

						return hoursInt >= 0 && hoursInt <= 23 && minutesInt >= 0 && minutesInt <= 59;
					}
				},
				defaultMessage: (validationArguments?: ValidationArguments) => {
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] is not in correct format HH:mm.`);

				},
			},
		});
	};
}

export function IsDateAfterNow(validationOptions?: ValidationOptions) {
	return (object: Record<string, any>, propertyName: string) => {
		registerDecorator({
			name: "isDateBeforeNow",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate: (value: string, args: ValidationArguments): boolean => {
					const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
					if (!dateRegex.test(value)) {
						return false;
					}

					return new Date(value) > new Date();
				},
				defaultMessage: (validationArguments?: ValidationArguments): string => {
					return UtilsExceptionMessageCommon.showMessageError(`The date in [${validationArguments.property}] should be before the current date.`);
				},
			},
		});
	};
}

export function IsEmail(validationOptions?: ValidationOptions) {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			name: "isEmail",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate: (value: any): boolean =>
					isEmail(value) && isString(value) && isNotEmpty(value.trim()),
				defaultMessage: (validationArguments?: ValidationArguments): string => {
					return UtilsExceptionMessageCommon.showMessageErrorWithData(`[${validationArguments.property}] must be an email.`, { "email": `[${validationArguments.property}] must be an email.` }, HttpStatus.UNPROCESSABLE_ENTITY);
				},
			},
		});
	};
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
	return (object: Record<string, any>, propertyName: string) => {
		registerDecorator({
			name: 'isStrongPassword',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate: (value: any): boolean => {
					const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
					return strongPasswordRegex.test(value);
				},
				defaultMessage: (validationArguments?: ValidationArguments): string => {
					const propertyName = validationArguments.property;
					return UtilsExceptionMessageCommon.showMessageErrorWithData("Invalid password. Must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters.", { [propertyName]: `[${validationArguments.property}] Invalid password. Must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters.` }, HttpStatus.UNPROCESSABLE_ENTITY);
				},
			},
		});
	};
}

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
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] cannot be empty.`);
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
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] cannot be empty.`);
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
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] must be an integer!`);
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
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] cannot be empty!`);
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
					return UtilsExceptionMessageCommon.showMessageError(`[${validationArguments.property}] Must be an integer and greater than 0!`);
				},
			},
		});
	};
}
