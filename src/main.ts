import './polyfills/polyfills';
import './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './environment/environment';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';
import { registerRequestContext } from './async-hooks';
import { AUTH_USER_CONTEXT_TOKEN } from './auth/auth-user-context-token';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  useContainer(app.select(ValidationModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(
    registerRequestContext(AUTH_USER_CONTEXT_TOKEN, context => context.switchToHttp().getRequest().user)
  );

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
  } else {
    // TODO use expressRateLimit in specific routes, I just don't know which yet
    // app.use(
    //   expressRateLimit({
    //     windowMs: 15 * 60 * 1000,
    //     max: 500,
    //   })
    // );
  }

  // TODO remove the contentSecurityPolicy when the domain is ready
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan('combined'));

  await app.listen(environment.port);
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
