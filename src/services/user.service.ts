import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';

@Injectable()
export class UserService {
  login({ email, password }): string {
    console.log('catchHello');
    const token = jwt.sign(
      { email, password },
      process.env.JWT_SECRET || 'jwtSecretKey',
      { expiresIn: '1h' },
    );
    return token;
  }
}
