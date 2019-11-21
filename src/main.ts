import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from "path";

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  passport.use(new GitHubStrategy({
      clientID: '40496946a2c62c5b2422',
      clientSecret: '2eead5d61f71d13a1afd1aee0375beb1c74a389f',
      callbackURL: '/succeed',
    },
    function(accessToken, refreshToken, profile, cb) {
      cb(null, accessToken);
    },
  ));
  app.use(passport.initialize());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}

bootstrap();
