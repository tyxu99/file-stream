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

  @Get('output')
  streamOutput(@Res() res: Response) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/event-stream');

    const str =
      '直到18世纪80年代两位德国语言学家鲁迪格和格雷尔曼以及英国学者雅各布·布赖恩才通过对吉卜赛方言的研究各自几乎同时期考证出欧洲吉卜赛人的来源他们发现吉卜赛语来自印度其中很多词汇与印度的梵文极为相似与印地语也十分接近他们因此得出结论吉卜赛人的发源地既不是埃及也不是波希米亚希腊而是印度';

    let count = 0;
    setInterval(() => {
      count++;
      if (count < 50) {
        const start = Math.floor(Math.random() * str.length);
        const data = str.slice(start, start + Math.floor(Math.random() * 5));

        // 输出格式遵循 event_stream 协议
        res.write('event: message\nid: ' + count + '\ndata: ' + data + '\n\n');
      }
    }, 300);
  }
}
