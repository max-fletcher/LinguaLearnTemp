import { Redis } from 'ioredis';
import { redisConfig } from '../config/redis.config';

export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(redisConfig);
  }

  async setRedisData(
    key: string,
    value: string | Buffer | number,
    expiresIn: number | null = null,
  ) {
    if (expiresIn) return await this.redis.set(key, value, 'EX', expiresIn);

    return await this.redis.set(key, value);
  }

  async getRedisData(key: string) {
    return await this.redis.get(key);
  }

  async deleteRedisData(key: string) {
    return await this.redis.del(key);
  }
}
