import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter for detailed error logging
  app.useGlobalFilters(new AllExceptionsFilter());

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, body } = req;
    
    console.log('\n🔵 Incoming Request:');
    console.log(`   ${method} ${originalUrl}`);
    if (Object.keys(body || {}).length > 0) {
      const sanitizedBody = { ...body };
      if (sanitizedBody.password) sanitizedBody.password = '***';
      console.log(`   Body:`, JSON.stringify(sanitizedBody, null, 2));
    }

    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - start;
      console.log(`\n✅ Response [${res.statusCode}] - ${duration}ms`);
      
      if (res.statusCode >= 400) {
        console.log(`   Error Response:`, data);
      }
      
      return originalSend.call(this, data);
    };

    next();
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('A simple Todo API with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
