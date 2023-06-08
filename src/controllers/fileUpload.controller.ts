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
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';

import * as fs from 'fs';
// import { writeRecursive } from '../../utils/helper';

@Controller('')
export class FileUploadController {
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

  @Get('isFileExist')
  isFileExist(@Query('filename') filename: string, @Res() res: Response) {
    res.send({ data: fs.existsSync(join('./uploads/', filename)) });
  }

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
}
