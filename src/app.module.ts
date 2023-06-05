import { Module } from '@nestjs/common';
import { FileUploadController } from './controllers/fileUpload.controller';
import { FileDownloadController } from './controllers/fileDownload.controller';
import { PrismaCRUDController } from './controllers/prismaCRUD.controller';
import { UserController } from './controllers/user.controller';
import { FileService } from './services/file.service';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [FileUploadController, FileDownloadController, UserController],
  providers: [FileService, UserService],
})
export class AppModule {}
