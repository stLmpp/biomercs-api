import './polyfills/polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './environment/environment';
import * as helmet from 'helmet';
import * as expressRateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { config } from 'dotenv';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';

if (!environment.production) {
  config();
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  useContainer(app.select(ValidationModule), { fallbackOnErrors: true });

  app.use(helmet());
  app.use(
    expressRateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
  app.use(compression());
  app.use(morgan('combined'));

  if (!environment.production) {
    app.enableCors();
    const options = new DocumentBuilder()
      .setTitle('Api')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, options, {});
    SwaggerModule.setup('help', app, document, {
      customCss: `.scheme-container { position: sticky; top: 0; z-index: 1; margin-bottom: 0; }`,
    });
  }

  await app.listen(environment.port, environment.host);
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('API initialized!');
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
