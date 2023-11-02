import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieSession = require('cookie-session');
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: [process.env.COOKIE_SECRET],
    }),
  );

  await app.listen(port);
  logger.verbose(`Application listening on port ${port}`);
}
bootstrap();
