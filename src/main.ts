import './polyfills/polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { useContainer } from 'class-validator';
import { ValidationModule } from './validation/validation.module';
import { registerRequestContext } from './async-hooks';
import { AUTH_USER_CONTEXT_TOKEN } from './auth/auth-user-context-token';
import { Environment } from './environment/environment';
import { SocketIoAdapter } from './environment/socket-io.adapter';
import { getMetadataArgsStorage, NamingStrategyInterface } from 'typeorm';

function checkEntitiesWithoutSchema(namingStrategy: NamingStrategyInterface): void {
  const entitiesWithoutSchema = getMetadataArgsStorage().tables.filter(
    table => !table.schema || table.schema === 'public'
  );
  if (entitiesWithoutSchema.length) {
    throw new Error(
      `There are entities without schema defined: \n\n${entitiesWithoutSchema
        .map(table => namingStrategy.tableName((table.target as any).name, undefined))
        .join('\n')}`
    );
  }
}

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
    checkEntitiesWithoutSchema(environment.typeormNamingStrategy);
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

  // CSP Disabled until I find a better solution
  app.use(helmet({ contentSecurityPolicy: false }));
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
