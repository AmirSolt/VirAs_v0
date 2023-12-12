import Redis from 'ioredis';

const redisurl = process.env.REDIS_URL;

if (!redisurl) {
    throw Error("You are missing one of the variables needed to send a message")
}

export const redis = new Redis(redisurl);