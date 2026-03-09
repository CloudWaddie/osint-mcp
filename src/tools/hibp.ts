import { BaseApiClient } from "../lib/api-client.js";
import { BreachResult, BreachResultSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export class HibpApiClient extends BaseApiClient {
  protected baseUrl = "https://haveibeenpwned.com/api/v3/";

  constructor() {
    // HIBP rate limit: 1 request per 1.5 seconds (40 requests per minute)
    super(40);
  }

  async checkBreaches(email: string): Promise<BreachResult[]> {
    const apiKey = configManager.get("HIBP_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "HIBP_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any[]>(`breachedaccount/${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "hibp-api-key": apiKey,
          "User-Agent": "OSINT-MCP-Server",
        },
      }, {
        truncateResponse: "false",
      });

      if (!data || data.length === 0) return [];

      return z.array(BreachResultSchema).parse(data.map((b: any) => ({
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        breachDate: b.BreachDate,
        addedDate: b.AddedDate,
        modifiedDate: b.ModifiedDate,
        pwnCount: b.PwnCount,
        description: b.Description,
        dataClasses: b.DataClasses,
        isVerified: b.IsVerified,
        isFabricated: b.IsFabricated,
        isSensitive: b.IsSensitive,
        isRetired: b.IsRetired,
        isSpamList: b.IsSpamList,
        logoPath: b.LogoPath,
      })));
    } catch (error: any) {
      if (error.message?.includes("404")) {
        // Not found means no breaches
        return [];
      }
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `HIBP error: ${(error as Error).message}`
      );
    }
  }
}
