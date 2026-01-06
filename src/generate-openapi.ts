import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { swaggerConfig } from './swagger-config';
import * as fs from 'fs';

async function generateOpenApi() {
    const app = await NestFactory.create(AppModule);

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

    await app.close();
    process.exit(0);
}

generateOpenApi();
