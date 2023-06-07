import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as process from 'process';
// import { AppService } from '../app.service';

@Controller('fileStream')
export class FileDownloadController {
  // constructor(private readonly appService: AppService) {}

  @Get(':filename')
  downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const filePath = join('./uploads', filename);
    if (fs.existsSync(filePath)) {
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      const fileStream = fs.createReadStream(filePath);
      const streamFile = new StreamableFile(fileStream);
      return streamFile;
    } else {
      res.send({ data: 'no such file' });
    }
  }
}
