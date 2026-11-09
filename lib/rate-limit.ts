const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit = 40,
  windowMs = 10 * 60 * 1000,
): { ok: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }

  bucket.count += 1;
  if (buckets.size > 5000) {
    for (const [k, value] of buckets) {
      if (now > value.reset) buckets.delete(k);
    }
  }
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.reset,
  };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
