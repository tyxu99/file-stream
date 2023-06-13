import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { FileService } from './services/file.service';
import { UserService } from './services/user.service';
import { PostsModule } from './posts/posts.module';
import { FileModule } from './file/file.module';
import { FileController } from './file/file.controller';

@Module({
  imports: [PostsModule, FileModule],
  controllers: [FileController, UserController],
  providers: [FileService, UserService],
})
export class AppModule {}
