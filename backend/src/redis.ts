import {createClient} from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const pubClient= createClient({
    url: REDIS_URL,
});
export const subClient= pubClient.duplicate();

subClient.on("error", (err) => {
  console.error("Redis Subscriber Error:", err);
});

pubClient.on("error", (err) => {
  console.error("Redis Publisher Error:", err);
});

export async function connectRedis() {
  try {
    await pubClient.connect();
    await subClient.connect();

    console.log("✅ Redis Connected");
  } catch (err) {
    console.error("❌ Redis Connection Failed", err);
  }
}