import { pubClient } from "../redis.js";
import { RATE_LIMIT, RATE_LIMIT_WINDOW } from "../constants/rateLimiter.js";

export async function isAllowed( key: string){
    const count = await pubClient.incr(key);

    if(count === 1){
        await pubClient.expire(key,RATE_LIMIT_WINDOW);
    }

    return {
        allowed: count <= RATE_LIMIT,
        remaining: Math.max(RATE_LIMIT - count, 0),
        count: count,
    }
}