/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public client: Redis;
  public pub: Redis;
  public sub: Redis;

  constructor() {
    // cache client
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    });

    // pub/sub clients
    this.pub = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    });

    this.sub = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.pub.quit();
    await this.sub.quit();
  }
}