import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as process from 'process';
import { StartAction } from '@nestjs/cli/actions';
// import { AppService } from '../app.service';

@Controller('fileStream')
export class FileDownloadController {
  // constructor(private readonly appService: AppService) {}

  @Get('normalDown/:filename')
  downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const filePath = join('./uploads', filename);
    if (fs.existsSync(filePath)) {
      res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Type, Content-Disposition',
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      const fileStream = fs.createReadStream(filePath);
      const streamFile = new StreamableFile(fileStream);
      return streamFile;
    } else {
      res.send({ data: 'no such file' });
    }
  }

  @Post('sliceDown/:filename')
  sliceDownFile(
    @Param('filename') filename: string,
    @Body('range') range: { start: number; end: number },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('filename range', filename, range);
    const filePath = join('./uploads', filename);
    const fileStream = fs.createReadStream(filePath, range);
    const streamFile = new StreamableFile(fileStream);
    return streamFile;
  }
}
