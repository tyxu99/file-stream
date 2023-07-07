import { Controller, Get, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

const prisma = new PrismaClient();

@Controller('employee')
export class EmployeeController {
  @Get('/list')
  async getEmployeeList(@Res() res: Response) {
    const data = await prisma.employee.findMany({
      where: {
        id: {
          gte: 1416,
        },
      },
      skip: 10,
      take: 5,
      orderBy: {
        id: 'desc',
      },
    });
    console.log(data);
    res.send({ data });
  }
}
