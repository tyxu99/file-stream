import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
  @IsNotEmpty({ message: '文件名必填' })
  @ApiProperty({ description: '文件名' })
  readonly filename: string;

  @IsNotEmpty({ message: '作品数量必填' })
  @IsNumber()
  @ApiProperty({ description: '作品数量' })
  readonly workNum: number;

  @ApiPropertyOptional({ description: '作者' })
  @IsString()
  readonly author: string;
}
