import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('ChawriMart API')
    .setDescription('B2B Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
