import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  app.useGlobalFilters(
    new HttpExceptionFilter()
  );
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );
  await app.listen(3000);
}
bootstrap();
