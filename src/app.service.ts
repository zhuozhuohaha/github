import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';

const Octokit = require('@octokit/rest');
const { exec } = require('child_process');
var Hexo = require('hexo');

@Injectable()
export class AppService {
  async getRepos(token: string, owner: string, repo: string) {

    const octokit = new Octokit({
      auth: `token ${token}`,
    });

    return await octokit.repos.get({
      owner,
      repo,
    });
  }

  async buildPage(owner: string, repo: string, themes: string = undefined) {
    let p = path.join(__dirname, '..', 'public', owner);

    await exec(`mkdir -p ${p}`, (err, stdout, stderr) => {
      if (err) {

      }
      else{
        exec(`git clone https://github.com/${owner}/${repo}`, { cwd: p }, (err, stdout, stderr) => {
          if (err) {
          }
          else{
            exec(` yarn && npx hexo g`, { cwd: path.join(p,repo) }, (err, stdout, stderr) => {
              if (err) {

              }
            });
          }
        });
      }
    });

    // if (themes) {
    //   exec(`mkdir -p ${p}/themes` , (err, stdout, stderr) => {
    //     if (err) {
    //       throw err;
    //     }
    //   });
    //   exec(`git clone ${themes}`, { cwd: path.join(p, 'themes') }, (err, stdout, stderr) => {
    //     if (err) {
    //       throw err;
    //     }
    //   });
    // }

    return;
  }

  async list(token: string, owner: string, repo: string, path: string): Promise<any> {

    const octokit = new Octokit({
      auth: `token ${token}`,
    });
    return await octokit.repos.getContents({
      owner,
      repo,
      path,
    });
  }

  async createOrUpdateFile(token: string, owner: string, repo: string, path: string, message: string, sha: string, content: string): Promise<any> {

    const octokit = new Octokit({
      auth: `token ${token}`,
    });
    return await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path,
      message,
      content,
      sha,
    });
  }

  async getAuthenticated(token: string): Promise<any> {

    const octokit = new Octokit({
      auth: `token ${token}`,
    });
    return await octokit.users.getAuthenticated();
  }
}
