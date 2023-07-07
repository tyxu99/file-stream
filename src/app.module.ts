import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { FileModule } from './file/file.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    PostsModule,
    FileModule,
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    EmployeeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('file');
  }
}
