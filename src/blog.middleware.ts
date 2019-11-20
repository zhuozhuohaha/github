import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { log } from "util";
import { RedisService } from 'nestjs-redis';
import { join } from 'path';

@Injectable()
export class BlogMiddleware implements NestMiddleware {

  constructor(private readonly redisService: RedisService,) {

  }
  async use(req: Request, res: Response, next: Function) {
    let host = req.hostname;
    let url = await this.redisService.getClient().get(host);
    if (url){
      res.sendFile(join(__dirname,'..','public',url,req.url),(err)=>{
        throw 404;
      });
    }
    else{
      next();
    }
  }
}
