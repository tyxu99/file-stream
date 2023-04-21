import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
// import { AppService } from '../app.service';

@Controller('fileStream')
export class FileDownloadController {
  // constructor(private readonly appService: AppService) {}

  @Get(':filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    res.download(join(process.cwd(), 'uploads', filename));
  }
}
