interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function createRateLimiter(maxAttempts: number, windowMs: number) {
  return async (c: any, next: any) => {
    const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
    const key = `${ip}-${c.req.path}`;
    const now = Date.now();

    // Initialize or get existing record
    if (!store[key]) {
      store[key] = { count: 0, resetTime: now + windowMs };
    }

    // Reset if window has expired
    if (now > store[key].resetTime) {
      store[key] = { count: 0, resetTime: now + windowMs };
    }

    store[key].count++;

    // set rate limit headers
    c.header("X-RateLimit-Limit", maxAttempts.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, maxAttempts - store[key].count).toString());
    c.header(
      "X-RateLimit-Reset",
      Math.ceil(store[key].resetTime / 1000).toString()
    );

    // check if exceeded the limit
    if (store[key].count > maxAttempts) {
      return c.json(
        { error: "Too many attempts. Please try again later." },
        429
      );
    }

    await next();
  };
}
