import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const VirusTotalResultSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    last_analysis_stats: z.object({
      harmless: z.number(),
      malicious: z.number(),
      suspicious: z.number(),
      timeout: z.number(),
      undetected: z.number(),
    }),
    last_analysis_results: z.record(z.any()),
    reputation: z.number(),
    total_votes: z.object({
      harmless: z.number(),
      malicious: z.number(),
    }),
    url: z.string(),
  }),
});

export type VirusTotalResult = z.infer<typeof VirusTotalResultSchema>;

export class VirusTotalApiClient extends BaseApiClient {
  protected baseUrl = "https://www.virustotal.com/api/v3/";

  constructor() {
    // VirusTotal free tier: 4 requests/min, 500 requests/day
    super(4);
  }

  async getUrlReputation(url: string): Promise<VirusTotalResult> {
    const apiKey = configManager.get("VIRUSTOTAL_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "VIRUSTOTAL_API_KEY is not configured"
      );
    }

    // URL ID is the base64 string of the URL (no padding)
    const urlId = Buffer.from(url).toString("base64").replace(/=/g, "");

    try {
      const data = await this.fetch<{ data: any }>(`urls/${urlId}`, {
        method: "GET",
        headers: {
          "x-apikey": apiKey,
        },
      });

      return VirusTotalResultSchema.parse(data.data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `VirusTotal error: ${(error as Error).message}`
      );
    }
  }
}
