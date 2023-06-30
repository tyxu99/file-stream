import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...', req, 'Response....', res);
    const { ip, url, query, params, method } = req;
    console.log(
      JSON.stringify({ ip, url, query, params, method }, null, '----'),
      res.statusCode,
    );
    next();
  }
}
