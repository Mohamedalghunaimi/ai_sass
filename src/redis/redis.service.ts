/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public client: Redis;
  public pub: Redis;
  public sub: Redis;

  constructor(
    config:ConfigService
  ) {
    // cache client
    this.client = new Redis({
      host: config.get<string>("REDIS_HOST") || 'redis',
      port: 6379,
    });

    // pub/sub clients
    this.pub = new Redis({
      host: config.get<string>("REDIS_HOST") || 'redis',
      port: 6379,
    });

    this.sub = new Redis({
      host: config.get<string>("REDIS_HOST") || 'redis',
      port: 6379,
    });
  }

  async onModuleDestroy() {
    await Promise.all([
      this.client.quit(),
      this.pub.quit(),
      this.sub.quit(),
    ]);
  }
}