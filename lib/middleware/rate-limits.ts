// lib/middleware/rate-limit.ts
const rateLimit = new Map();

export function checkRateLimit(ip: string, limit = 5, window = 60000) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  const recentRequests = userRequests.filter((time: number) => now - time < window);
  
  if (recentRequests.length >= limit) {
    throw new Error('Too many requests');
  }
  
  rateLimit.set(ip, [...recentRequests, now]);
}