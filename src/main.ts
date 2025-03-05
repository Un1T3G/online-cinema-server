import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { CoreModule } from './core/core.module';

const PORT = process.env.PORT || 7000;

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  app.setGlobalPrefix('api');
  app.use(
    cors({
      origin: ['http://localhost:3000', process.env.CLIENT_URL],
    }),
  );

  await app.listen(PORT);
}
bootstrap();
