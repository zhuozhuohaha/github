import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Test } from './test.entity';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService, private readonly appService: AppService) {
  }

  @Post('/api/bind')
  async bind(@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string, @Body('url') host: string) {
    let url = join(owner, repo);
    let token = (<any> req).session.user;
    if (token && (await this.appService.getRepos(token, owner, repo)).data.permissions.push) {
      await this.redisService.getClient().set(host, url);
      this.appService.buildPage(owner, repo);
      return 'ok';
    } else {
      return '';
    }
  }

  @Post('/api/list')
  async list(@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string, @Body('path') path: string) {
    let token = (<any> req).session.user;
    if (token) {
      return await this.appService.list(token, owner, repo, path);
    }
    return '';
  }

  @Post('/api/update')
  async update(@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string, @Body('path') path: string,
               @Body('sha')sha: string, @Body('content')content: string, @Body('message')message: string) {
    let token = (<any> req).session.user;
    if (token) {
      return await this.appService.createOrUpdateFile(token, owner, repo, path, message, sha, content);
    }
    return '';
  }

  @Post('/api/flash')
  async flash(@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string) {
    let token = (<any> req).session.user;
    if (token && (await this.appService.getRepos(token, owner, repo)).data.permissions.push) {
      return;
    } else {
      return '';
    }
  }

  @Get('/succeed')
  @UseGuards(AuthGuard('github'))
  async succeed(@Req() req: Request, @Res() res: Response) {
    (<any> req).session.user = (<any> req).user;
    res.redirect('/');
  }

  @Get('/login')
  @UseGuards(AuthGuard('github'))
  login(@Req() req: Request) {
  }

  @Get()
  async index(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'), (err) => {
      if (err) {
        throw 404;
      }
    });
  }

  @Post('/api/test')
  async pass(@Query('token')token:string,@Query('id')id:number) {
    let b = new Test();
    let ans = await this.appService.getAuthenticated(token);
    if (!ans){
      return 'fail';
    }
    b.ques  =id;
    b.name  =ans.data.id;
    b.save();
    return 'ok';
  }

  @Get('/api/test')
  async getPass(@Req() req: Request) {
    let token = (<any> req).session.user;
    if (token) {
      let ans = await this.appService.getAuthenticated(token);
      if (!ans){
        return 'fail';
      }
      return await Test.find({name:ans.data.id});
    }
    return 'bad';
  }

  @Get('/**')
  async all() {
    return '';
  }

}
