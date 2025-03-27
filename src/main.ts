import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

env();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    ['/api-swagger'],
    expressBasicAuth({
      challenge: true,
      users: { sang: 'dev' },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const options = new DocumentBuilder()
    .setTitle('api documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      {
        name: 'authorization',
        type: 'apiKey',
        in: 'header',
      },
      'authorization',
    )
    .build();
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, async () => {
    console.log('DPT listening port: ', port);
  });
}

bootstrap();

async function env() {
  if (fs.existsSync(`${__dirname}/../.env`)) {
    console.log('has vault file:', true);
    const envLoad = dotenv.config({ path: `${__dirname}/../.env` });
    if (envLoad.error) {
      throw envLoad.error;
    }
  } else {
    console.log('has vault file:', false, fs.existsSync('/buchet/.env'));
    const envLoad = dotenv.config();
    if (envLoad.error) {
      throw envLoad.error;
    }
  }
}
