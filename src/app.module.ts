import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { FileModule } from './file/file.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [PostsModule, FileModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('file');
  }
}
