import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  getFilename(val: string) {
    return val;
  }
}
