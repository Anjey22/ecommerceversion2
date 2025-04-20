import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
//redis like a json key-value store
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
//await client.set('foo', 'bar');