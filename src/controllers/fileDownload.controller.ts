import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
// import { AppService } from '../app.service';

@Controller('fileStream')
export class FileDownloadController {
  // constructor(private readonly appService: AppService) {}

  @Get(':filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    fs.readdir(join('./uploads'), (err, files) => {
      if (err) {
        res.send({ data: 'no such file' });
      }

      if (files.includes(filename)) {
        const filePath = join('./uploads/', filename);
        const file = fs.createReadStream(filePath);
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'images/png');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + filename,
        );
        res.set({
          'Content-Length': stat.size,
          'Content-Type': 'images/png',
          'Content-Disposition': 'attachment; filename=' + filename,
        });
        // return new StreamableFile(file);

        file.pipe(res);
        // res.send({ [filename]: files });
        // console.log(files);
      } else {
        res.send({ data: 'no such file' });
      }
    });
  }
}
