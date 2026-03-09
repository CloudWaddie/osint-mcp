import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const ZoomEyeResultSchema = z.object({
  total: z.number().optional(),
  matches: z.array(z.any()).optional(),
});

export type ZoomEyeResult = z.infer<typeof ZoomEyeResultSchema>;

export class ZoomEyeApiClient extends BaseApiClient {
  protected baseUrl = "https://api.zoomeye.org/";

  constructor() {
    // ZoomEye free tier is limited
    super(10);
  }

  async searchHost(query: string): Promise<ZoomEyeResult> {
    const apiKey = configManager.get("ZOOMEYE_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "ZOOMEYE_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>("host/search", {
        method: "GET",
        headers: {
          "API-KEY": apiKey,
        },
      }, {
        query,
      });

      return ZoomEyeResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `ZoomEye error: ${(error as Error).message}`
      );
    }
  }
}
