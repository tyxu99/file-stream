import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import * as fs from 'fs';

@Controller('')
export class FileUploadController {
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

  @Post('uploadHugeFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadHugeFile(
    @UploadedFile() file: any,
    @Body('filename') filename: string,
    @Body('current') current: string,
    @Res() res: Response,
  ) {
    console.log(file, filename, current);

    const savedFileName = current + '-' + Date.now() + filename;
    const savedFileLocation = `./uploads/chunks/${savedFileName}`; // 保存在磁盘上的完整路径
    // 重命名文件
    fs.renameSync(file, savedFileLocation);

    res.send({ msg: 'chunk uploaded' });
  }

  @Post('mergeFileChunks')
  async mergeFileChunks(
    @Body('filename') filename: string,
    @Body('chunkQuantity') chunkQuantity: number,
  ) {
    async function mergeChunks(
      fileName: string,
      fileFolder: string,
      chunkQuantity: number,
    ) {
      const chunks: string[] = [];
      for (let i = 0; i < chunkQuantity; i++) {
        chunks.push(join(fileFolder, `${fileName}.part${i + 1}`));
      }
      const writeStream = fs.createWriteStream(join(fileFolder, fileName));
      await Promise.all(
        chunks.map((chunkPath) => {
          return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(chunkPath);
            readStream.pipe(writeStream, { end: false });
            readStream.on('end', () => {
              fs.unlinkSync(chunkPath);
              resolve('ok');
            });
            readStream.on('error', (error) => {
              reject(error);
            });
          });
        }),
      );
      writeStream.end();
    }
    const fileFolder = join(__dirname, './uploads/' + filename);
    await mergeChunks(filename, fileFolder, chunkQuantity);
    console.log(filename);
  }
}
