import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ExceptionResponseDetail } from './utils.common/utils.exception.common/utils.exception.common';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.setGlobalPrefix("/api")

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                throw new HttpException(
                    new ExceptionResponseDetail(
                        HttpStatus.BAD_REQUEST,
                        Object.values(validationErrors[0].constraints)[0]
                    ),
                    HttpStatus.BAD_REQUEST
                );
            },
        })
    );

    const config = new DocumentBuilder()
        .setTitle("CINEMA VERSION 1")
        .setDescription(
            `Không biết mô tả sao nha ^.^`
        )
        .setVersion("1.0")
        .setBasePath("api")
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            "access-token"
        )
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.enableCors();

    await app.listen(process.env.PORT, "0.0.0.0");

    console.log(
        `Application is running on: ${await app.getUrl()}`
    );
}
bootstrap();
