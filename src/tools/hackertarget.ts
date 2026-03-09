import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export const SubdomainSchema = z.object({
  domain: z.string(),
  ip: z.string(),
});

export type Subdomain = z.infer<typeof SubdomainSchema>;

export class HackerTargetApiClient extends BaseApiClient {
  protected baseUrl = "https://api.hackertarget.com/";

  constructor() {
    // HackerTarget free tier: 50 requests/day per IP
    super(1); 
  }

  async getSubdomains(domain: string): Promise<Subdomain[]> {
    try {
      const response = await fetch(`${this.baseUrl}hostsearch/?q=${domain}`);
      
      if (!response.ok) {
        throw new McpError(ErrorCode.InternalError, "HackerTarget API failed");
      }

      const text = await response.text();
      if (text.includes("API count exceeded")) {
        throw new McpError(ErrorCode.InvalidRequest, "HackerTarget API limit exceeded");
      }

      const lines = text.trim().split("\n");
      return lines.map(line => {
        const [sub, ip] = line.split(",");
        return { domain: sub, ip };
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `HackerTarget error: ${(error as Error).message}`
      );
    }
  }

  async getDnsLookup(domain: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}dnslookup/?q=${domain}`);
      if (!response.ok) throw new Error("API failed");
      return await response.text();
    } catch (error) {
       throw new McpError(ErrorCode.InternalError, `DNS Lookup failed: ${(error as Error).message}`);
    }
  }
}
