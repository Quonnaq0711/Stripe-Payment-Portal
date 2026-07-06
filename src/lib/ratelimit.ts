import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";  

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 requests per minute
})
export default ratelimit;