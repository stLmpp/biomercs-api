import './polyfills/polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';
import { registerRequestContext } from './async-hooks';
import { AUTH_USER_CONTEXT_TOKEN } from './auth/auth-user-context-token';
import { Environment } from './environment/environment';
import { SocketIoAdapter } from './environment/socket-io.adapter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  useContainer(app.select(ValidationModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(
    registerRequestContext(AUTH_USER_CONTEXT_TOKEN, context => context.switchToHttp().getRequest().user)
  );

  const environment = app.get(Environment);

  if (!environment.production) {
    app.enableCors();
    const options = new DocumentBuilder()
      .setTitle('Api')
      .setVersion(version)
      .addBearerAuth({
        scheme: 'bearer',
        type: 'http',
        bearerFormat: 'JWT',
      })
      .build();
    const document = SwaggerModule.createDocument(app, options, {});
    SwaggerModule.setup('help', app, document, {
      customCss: `.swagger-ui .scheme-container { position: sticky; top: 0; z-index: 1; margin-bottom: 0; padding: 0.25rem 0; }`,
    });
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'font-src': [`'self'`, 'https://fonts.googleapis.com'],
          'style-src': [`'self'`, 'https://fonts.googleapis.com/'],
        },
      },
    })
  );
  app.use(compression());
  app.use(morgan('combined'));

  app.useWebSocketAdapter(new SocketIoAdapter(app, environment));

  await app.listen(environment.get('PORT'));
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
