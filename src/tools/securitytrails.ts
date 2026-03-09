import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const SecurityTrailsResultSchema = z.object({
  endpoint: z.string().optional(),
  subdomains: z.array(z.string()).optional(),
  current_dns: z.any().optional(),
  history: z.any().optional(),
});

export type SecurityTrailsResult = z.infer<typeof SecurityTrailsResultSchema>;

export class SecurityTrailsApiClient extends BaseApiClient {
  protected baseUrl = "https://api.securitytrails.com/v1/";

  constructor() {
    // SecurityTrails free tier: 50 requests/month, but let's limit per min
    super(10);
  }

  async getSubdomains(domain: string): Promise<SecurityTrailsResult> {
    const apiKey = configManager.get("SECURITYTRAILS_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "SECURITYTRAILS_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>(`domain/${domain}/subdomains`, {
        method: "GET",
        headers: {
          APIKEY: apiKey,
        },
      });

      return SecurityTrailsResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `SecurityTrails error: ${(error as Error).message}`
      );
    }
  }
}
