import { Body, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('login')
  login(
    @Body() data: { email: string; password: string },
    @Res() res: Response,
  ) {
    console.log(data);
    const token = this.userService.login(data);
    console.log(token);
    return res.send({ ...data, token });
  }
  // @Get('logoff')
  // logoff(@Body)
}
