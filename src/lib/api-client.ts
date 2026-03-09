import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private maxTokens: number;
  private refillRate: number; // tokens per millisecond

  constructor(requestsPerMinute: number) {
    this.maxTokens = requestsPerMinute;
    this.tokens = requestsPerMinute;
    this.refillRate = requestsPerMinute / (60 * 1000);
    this.lastRefill = Date.now();
  }

  async waitForToken(): Promise<void> {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    const waitTime = (1 - this.tokens) / this.refillRate;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    this.refill();
    this.tokens -= 1;
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

export abstract class BaseApiClient {
  protected abstract baseUrl: string;
  protected rateLimiter?: RateLimiter;

  constructor(rateLimitPerMinute?: number) {
    if (rateLimitPerMinute) {
      this.rateLimiter = new RateLimiter(rateLimitPerMinute);
    }
  }

  protected async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<T> {
    if (this.rateLimiter) {
      await this.rateLimiter.waitForToken();
    }

    const url = new URL(endpoint, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: {
          "Accept": "application/json",
          ...options.headers,
        },
      });

      if (response.status === 429) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Rate limit exceeded for ${this.baseUrl}`
        );
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Unknown error");
        throw new McpError(
          ErrorCode.InternalError,
          `API request failed: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Network error: ${(error as Error).message}`
      );
    }
  }
}
