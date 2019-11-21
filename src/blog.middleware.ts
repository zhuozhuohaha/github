import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedisService } from 'nestjs-redis';
import { join } from 'path';

@Injectable()
export class BlogMiddleware implements NestMiddleware {

  constructor(private readonly redisService: RedisService) {

  }

  async use(req: Request, res: Response, next: Function) {
    let host = req.hostname;
    let url = await this.redisService.getClient().get(host);
    if (url) {
      let p = join(__dirname, '..', 'public', url, 'public', req.url);
      p = p.split('?')[0];
      if (p.split('.').length<2)
        p+='/index.html';
      res.sendFile(p, (err) => {
        if (err){
          console.log('404');
          res.send('404');
        }
      });
    } else {
      next();
    }
  }
}
