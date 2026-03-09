import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const OtxResultSchema = z.object({
  pulse_info: z.object({
    count: z.number(),
    pulses: z.array(z.any()),
  }).optional(),
  base_indicator: z.any().optional(),
  general: z.any().optional(),
});

export type OtxResult = z.infer<typeof OtxResultSchema>;

export class OtxApiClient extends BaseApiClient {
  protected baseUrl = "https://otx.alienvault.com/api/v1/";

  constructor() {
    // OTX API is fairly generous with rate limits
    super(60);
  }

  async getIndicatorDetails(type: "IPv4" | "domain" | "hostname", indicator: string): Promise<OtxResult> {
    const apiKey = configManager.get("ALIENVAULT_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "ALIENVAULT_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>(`indicators/${type}/${indicator}/general`, {
        method: "GET",
        headers: {
          "X-OTX-API-KEY": apiKey,
        },
      });

      return OtxResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `AlienVault OTX error: ${(error as Error).message}`
      );
    }
  }
}
