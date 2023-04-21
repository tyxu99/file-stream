import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
// import { AppService } from '../app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('files')
export class FileUploadController {
  // constructor(private readonly appService: AppService) {}

  // @Post('normalFormDataUpload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       limits: {
  //         fileSize: 1024 * 1024 * 10,
  //       },
  //       filename: (req, file, cb) => {
  //         const filename = file.originalname.split('.')[0];
  //         const extension = extname(file.originalname);
  //         cb(null, `${filename}${extension}`);
  //       },
  //       fileFilter: (req, file, cb) => {
  //         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //           return cb(new Error('file type error'), false);
  //         }
  //         cb(null, true);
  //       },
  //     }),
  //   }),
  // )

  @Post('fileStreamUpload')
  fileStreamUpload(@Body() data: any, @Res() res: Response) {
    console.log('data', data);
    // const filePath = path.join(__dirname, '..', 'uploads', filename);
    // const writeStream = fs.createWriteStream(filePath);
    // data.pipe(writeStream);
    // return new Promise((resolve, reject) => {
    //   data.on('end', () => {
    //     resolve({ success: true });
    //   });
    //   writeStream.on('error', (err) => {
    //     reject(err);
    //   });
    // });
    return res.send({ code: 200, success: true });
  }
}
