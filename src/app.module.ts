import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from 'nestjs-redis';
import { BlogMiddleware } from './blog.middleware';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';
var redis = require('redis');
var session = require('express-session');
var redisClient = redis.createClient(6379, 'server.jihuayu.site');
var RedisStore = require('connect-redis')(session);

@Module({
  imports: [RedisModule.register({
    host: 'server.jihuayu.site',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ExpressSessionMiddleware.configure({
      store:new RedisStore({client: redisClient}),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
    });

    consumer
      .apply(ExpressSessionMiddleware,BlogMiddleware)
      .forRoutes(AppController);
  }
}
