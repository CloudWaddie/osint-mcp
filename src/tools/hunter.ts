import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const HunterResultSchema = z.object({
  data: z.object({
    domain: z.string(),
    organization: z.string().nullable(),
    emails: z.array(z.object({
      value: z.string(),
      type: z.string(),
      confidence: z.number(),
      sources: z.array(z.any()),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      position: z.string().nullable(),
    })),
  }),
});

export type HunterResult = z.infer<typeof HunterResultSchema>;

export class HunterApiClient extends BaseApiClient {
  protected baseUrl = "https://api.hunter.io/v2/";

  constructor() {
    // Hunter.io free tier: 25 requests/month, but let's limit per min
    super(15);
  }

  async domainSearch(domain: string): Promise<HunterResult> {
    const apiKey = configManager.get("HUNTER_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "HUNTER_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>("domain-search", {
        method: "GET",
      }, {
        domain,
        api_key: apiKey,
      });

      return HunterResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Hunter.io error: ${(error as Error).message}`
      );
    }
  }
}
