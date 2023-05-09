import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FileUploadController {
  // constructor(private readonly appService: AppService) {}

  @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 10 } }),
  // )
  uploadFile(@Body() data: any, @Res() res: Response) {
    console.log(data);
    res.send({ code: 200, message: 'ok' });
  }
}
