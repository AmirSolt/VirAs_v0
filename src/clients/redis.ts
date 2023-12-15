import Redis from 'ioredis';
import * as dotenv from 'dotenv'
dotenv.config()

if(process.env.REDIS_URL == null){
    throw new Error('missing REDIS_URL');
}

const redisurl = process.env.REDIS_URL;

if (!redisurl) {
    throw Error("You are missing one of the variables needed to send a message")
}

export const redis = new Redis(redisurl, );

