/**
 * In-memory IP rate limiter for POST /api/lead.
 *
 * MVP-grade only. State lives in a single Node process's memory:
 * - It resets on every server restart/redeploy.
 * - It is NOT shared across multiple instances/regions, and will not work
 *   correctly behind horizontally-scaled or serverless multi-instance
 *   hosting (each instance gets its own independent counters).
 *
 * This is enough to blunt accidental rapid-fire double submits and very
 * basic single-instance scripted abuse. Before scaling past one instance,
 * replace this with a shared store (e.g. Redis/Upstash).
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const buckets = new Map<string, Bucket>();

/** Drop buckets whose window has fully elapsed so the map doesn't grow forever. */
function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/** Returns whether `identifier` (e.g. client IP) may make another request right now. */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(identifier);
  if (!existing || now - existing.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.windowStart + WINDOW_MS - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true };
}
