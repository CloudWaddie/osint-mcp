import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const GreyNoiseResultSchema = z.object({
  ip: z.string(),
  seen: z.boolean(),
  classification: z.string().optional(),
  first_seen: z.string().optional(),
  last_seen: z.string().optional(),
  actor: z.string().optional(),
  tags: z.array(z.string()).optional(),
  vpn: z.boolean().optional(),
  vpn_service: z.string().optional(),
  bot: z.boolean().optional(),
  metadata: z.any().optional(),
});

export type GreyNoiseResult = z.infer<typeof GreyNoiseResultSchema>;

export class GreyNoiseApiClient extends BaseApiClient {
  protected baseUrl = "https://api.greynoise.io/v2/";

  constructor() {
    // GreyNoise Community API: no strict rate limit but let's be safe
    super(30);
  }

  async getIpContext(ip: string): Promise<GreyNoiseResult> {
    const apiKey = configManager.get("GREYNOISE_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "GREYNOISE_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>(`noise/context/${ip}`, {
        method: "GET",
        headers: {
          key: apiKey,
        },
      });

      return GreyNoiseResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `GreyNoise error: ${(error as Error).message}`
      );
    }
  }
}
