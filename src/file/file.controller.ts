import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import * as fs from 'fs';
import { FileDto } from '../file/file.dto';

@ApiTags('文件上传')
@Controller('file')
export class FileController {
  @ApiOperation({ summary: '获取文件列表' })
  @Get('fileList')
  getFileList(@Res() res: Response) {
    fs.readdir(join('./uploads'), (err, files) => {
      if (err) {
        res.send({ data: 'read fileList error' });
      }

      const regex = /^\..+/; // 定义正则表达式，匹配以 . 开头的文件
      const filteredFiles = files.filter((file) => !regex.test(file));

      const t: any[] = [];
      filteredFiles.forEach((file) => {
        const filePath = join('./uploads', file);
        const stats = fs.statSync(filePath);
        t.push({
          fileName: file,
          fileSize: err ? 0 : stats.size,
          fileType: extname(file),
        });
      });
      res.send({ data: t });
    });
  }

  @ApiOperation({ summary: '上传单个文件' })
  @Post('uploadSingleFile')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedType = ['image/jpg', 'image/png', 'image/jpeg'];
        if (allowedType.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Unsupported File Type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const ext = extname(file.originalname);
          cb(null, `${name}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    res.send({ message: 'uploaded' });
  }

  @ApiOperation({ summary: '上传多个文件' })
  @Post('uploadFileArray')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedType = ['image/jpeg', 'image/png'];
        if (allowedType.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Unsupported File Type', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const ext = extname(file.originalname);
          cb(null, `${name}-${Date.now()}${ext}`);
        },
      }),
    }),
  )
  uploadFileArray(
    @UploadedFiles() file: Express.Multer.File[],
    @Body('name') name: string,
    @Body('current') current: string,
    @Res() res: any,
  ) {
    try {
      console.log('bbbody', file, '======', name, current);
      res.send({ name: 'aaaaaa' });
    } catch (err) {
      console.log(err);
    }
  }

  @ApiOperation({ summary: '文件是否已存在' })
  @Get('isFileExist')
  isFileExist(@Query('filename') filename: string, @Res() res: Response) {
    res.send({ data: fs.existsSync(join('./uploads/', filename)) });
  }

  @ApiOperation({ summary: '分片上传大文件' })
  @Post('uploadHugeFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadHugeFile(
    @UploadedFile() file: any,
    @Body('filename') filename: string,
    @Body('current') current: string,
    @Res() res: Response,
  ) {
    const ws = fs.createWriteStream(
      join('./uploads/', filename + '-chunk-' + current),
    );
    ws.write(file.buffer, (err) => {
      if (err) {
        console.log('write failed');
      } else {
        ws.end();
      }
    });

    res.send({ msg: 'chunk uploaded' });
  }

  @ApiOperation({ summary: '合并文件' })
  @Get('mergeFileChunks')
  async mergeFileChunks(
    @Query('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log('mergeFileChunks', filename);
    fs.readdir(join('./uploads'), (err, file) => {
      if (err) {
        console.log('read uploads chunks failed', err);
      } else {
        const selectedChunks = file
          .filter((d) =>
            d.includes(
              filename.slice(0, filename.lastIndexOf('.')) + '-chunk-',
            ),
          )
          .sort(
            (a: string, b: string) =>
              parseInt(a.split('-')[2]) - parseInt(b.split('-')[2]),
          )
          .map((d) => join('./uploads', d));
        const ws = fs.createWriteStream(join('./uploads/', filename));

        const writeRecursive = (fileList, writeStream) => {
          if (fileList.length) {
            const filePath = fileList.shift();
            const rs = fs.createReadStream(filePath);
            rs.pipe(writeStream, { end: false });
            rs.on('end', () => {
              writeRecursive(fileList, writeStream);
            });
          } else {
            writeStream.end();
          }
        };

        writeRecursive([...selectedChunks], ws);
        ws.on('close', () => {
          selectedChunks.forEach((path) => {
            if (fs.existsSync(path)) {
              fs.unlinkSync(path);
              console.log(path, ' deleted');
            } else {
              console.log(path, ' file not exist');
            }
          });
        });
        res.send({ data: selectedChunks });
      }
    });
  }

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
      res.setHeader('Cache-Control', 'max-age=36000');
      res.setHeader('Vary', 'User-Agent');
      const fileStream = fs.createReadStream(filePath);
      const streamFile = new StreamableFile(fileStream);
      return streamFile;
    } else {
      res.send({ data: 'no such file' });
    }
  }

  @Get('downFilePath/:filename')
  downFileFromPath(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join('./uploads', filename);
    if (fs.existsSync(filePath)) {
      // res.setHeader(
      //   'Access-control-Expose-Headers',
      //   'Content-Type, Content-Disposition',
      // );
      res.send({ data: 'http://127.0.0.1:8888/' + filePath });
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
