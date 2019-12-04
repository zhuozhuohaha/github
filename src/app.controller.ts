import { Body, Controller, Get, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Test } from './test.entity';
import { Blog } from './blog.entity';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService, private readonly appService: AppService) {
  }

  @Post('/api/blog/bind')
  async bind(@Res() res:Response,@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string, @Body('url') host: string) {
    let url = join(owner, repo);
    let token = (<any> req).session.user;
    if (token && (await this.appService.getRepos(token, owner, repo)).data.permissions.push) {
      await this.redisService.getClient().set(host, url);
      let b  = new Blog();
      b.owner  = owner;
      b.repo = repo;
      b.url = host;
      b.time = new Date().toLocaleDateString();
      this.appService.buildPage(owner, repo,b);
      res.redirect('/blog');
    } else {
      return '';
    }
  }

  @Post('/api/blog/up')
  async update1(@Res() res:Response,@Req() req: Request, @Body('owner') owner: string, @Body('repo') repo: string) {
    let url = join(owner, repo);
    let token = (<any> req).session.user;
    if (token && (await this.appService.getRepos(token, owner, repo)).data.permissions.push) {
      this.appService.upPage(owner, repo);
      res.redirect('/blog');
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
  @Get('/editor')
  async list1(@Res() res:Response,@Req() req: Request, @Query('url') url: string) {
    let token = (<any> req).session.user;
    let o = url.split('/');
    if (token) {
      let data = (await this.appService.list(token, o[3], o[4],o.slice(7).join('/'))).data;
      if (data.length)
        return res.render('file',{data:data});
      else{
        return res.render('editor',{data:data});

      }
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

  @Get('/up')
  @Render('up')
  up(@Req() req: Request) {
  }
  @Get()
  @Render('index')
  async index(@Req() req: Request,@Res() res: Response) {
    let token = (<any> req).session.user;
    if (token)
    return ({user:(await this.appService.getAuthenticated(token)).data.name});
    else {
      return ;
    }
  }

  @Get('/blog')
  @Render('blog')
  async blog(@Req() req: Request,@Res() res: Response) {
    let token = (<any> req).session.user;
    if (token)
      return ({user:(await this.appService.getAuthenticated(token)).data.name,blog:await this.appService.getBlogList()});
    else {
      return ;
    }
  }
  @Get('/code')
  @Render('code')
  async code(@Req() req: Request,@Res() res: Response) {
  }
  @Get('/bind')
  @Render('bind')
  async bind1(@Req() req: Request,@Res() res: Response) {
  }

  @Get('/test')
  @Render('test')
  async test(@Req() req: Request,@Res() res: Response) {
    let token = (<any> req).session.user;
    if (token){
      let ans = (await this.appService.getAuthenticated(token)).data.name;
      return {test:await Test.find({name:ans})}
    }
    else {
      return ;
    }
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
