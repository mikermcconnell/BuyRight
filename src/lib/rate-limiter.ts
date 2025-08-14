// Rate limiting utility for BuyRight API endpoints
// Implements sliding window rate limiting with Redis-like behavior using in-memory store
// For production, replace with Redis or similar distributed cache

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessful?: boolean; // Only count failed attempts
  keyGenerator?: (identifier: string) => string; // Custom key generation
}

interface RateLimitEntry {
  requests: Array<{
    timestamp: number;
    success: boolean;
  }>;
  blocked: boolean;
  blockedUntil?: number;
}

class InMemoryRateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      // Remove entries with no recent requests (older than 1 hour)
      const hasRecentRequests = entry.requests.some(
        req => now - req.timestamp < 60 * 60 * 1000
      );

      if (!hasRecentRequests && (!entry.blockedUntil || now > entry.blockedUntil)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.store.delete(key));
  }

  get(key: string): RateLimitEntry | undefined {
    return this.store.get(key);
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Global store instance
const rateLimitStore = new InMemoryRateLimitStore();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      message: config.message || 'Too many requests, please try again later.',
      skipSuccessful: config.skipSuccessful || false,
      keyGenerator: config.keyGenerator || ((id: string) => `rate_limit:${id}`),
    };
  }

  async check(identifier: string, wasSuccessful?: boolean): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(identifier);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key) || {
      requests: [],
      blocked: false,
    };

    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        blocked: true,
      };
    }

    // Clean up old requests outside the window
    entry.requests = entry.requests.filter(req => req.timestamp > windowStart);

    // Count relevant requests based on configuration
    const relevantRequests = this.config.skipSuccessful
      ? entry.requests.filter(req => !req.success)
      : entry.requests;

    // Check if limit exceeded
    if (relevantRequests.length >= this.config.maxRequests) {
      // Block for the remainder of the window
      entry.blocked = true;
      entry.blockedUntil = windowStart + this.config.windowMs;
      rateLimitStore.set(key, entry);

      return {
        success: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        blocked: true,
      };
    }

    // Add current request
    entry.requests.push({
      timestamp: now,
      success: wasSuccessful !== false, // Default to true if not specified
    });

    // Reset blocked status if not currently blocked
    entry.blocked = false;
    entry.blockedUntil = undefined;

    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, this.config.maxRequests - relevantRequests.length - 1);
    const resetTime = windowStart + this.config.windowMs;

    return {
      success: true,
      remaining,
      resetTime,
      blocked: false,
    };
  }

  async reset(identifier: string): Promise<void> {
    const key = this.config.keyGenerator(identifier);
    rateLimitStore.delete(key);
  }
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 failed attempts per 15 minutes
  skipSuccessful: true, // Only count failed login attempts
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

export const registerRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 registration attempts per hour
  message: 'Too many registration attempts. Please try again later.',
});

export const generalApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'API rate limit exceeded. Please slow down.',
});

// Utility function to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  let ip = forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'unknown';
  
  // Fallback to user-agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8);
  
  return `${ip}_${userAgentHash}`;
}

// Utility function to get user-specific identifier
export function getUserIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user_${userId}`;
  }
  
  // Fall back to client identifier if no user ID
  return getClientIdentifier(request);
}

// Middleware-style wrapper for rate limiting
export function withRateLimit(rateLimiter: RateLimiter) {
  return async function(
    request: Request,
    identifier?: string,
    wasSuccessful?: boolean
  ): Promise<{ allowed: boolean; response?: Response }> {
    const clientId = identifier || getClientIdentifier(request);
    const result = await rateLimiter.check(clientId, wasSuccessful);

    if (!result.success) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: rateLimiter['config'].message,
            },
            resetTime: result.resetTime,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': rateLimiter['config'].maxRequests.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString(),
            },
          }
        ),
      };
    }

    return { allowed: true };
  };
}

// Export rate limit store for testing
export { rateLimitStore };