import { Body, Injectable } from '@nestjs/common';
import * as path from 'path';
import { worker } from 'cluster';
const Octokit = require("@octokit/rest");
const { exec } = require('child_process');
@Injectable()
export class AppService {
  async getRepos(token:string,owner:string,repo:string) {

    const octokit = new Octokit({
      auth: `token ${token}`
    });

    return await octokit.repos.get({
      owner,
      repo
    });
  }

  async buildPage(owner:string,repo:string){
    let p = path.join(__dirname,'..', 'public',owner,repo);
    exec(`git clone https://github.com/${owner}/${repo}`, { cwd: p }, (err, stdout, stderr) => {
      if(err) {
        throw 501;
      }
    });

    return ;
  }

  async list(token:string,owner:string,repo:string,path:string): Promise<any> {

    const octokit = new Octokit({
      auth: `token ${token}`
    });
    return await octokit.repos.getContents({
      owner,
      repo,
      path
    });
  }
  async createOrUpdateFile(token:string,owner:string,repo:string,path:string,message:string,sha:string,content:string): Promise<any> {

    const octokit = new Octokit({
      auth: `token ${token}`
    });
    return await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path,
      message,
      content,
      sha
    });
  }

}
