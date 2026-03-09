import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const SauceNaoResultSchema = z.object({
  header: z.any(),
  results: z.array(z.object({
    header: z.any(),
    data: z.any(),
  })),
});

export type SauceNaoResult = z.infer<typeof SauceNaoResultSchema>;

export class SauceNaoApiClient extends BaseApiClient {
  protected baseUrl = "https://saucenao.com/";

  constructor() {
    // SauceNAO free tier: 4-6 requests per minute
    super(6);
  }

  async searchUrl(url: string): Promise<SauceNaoResult> {
    const apiKey = configManager.get("SAUCENAO_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "SAUCENAO_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>("search.php", {
        method: "GET",
      }, {
        db: 999,
        output_type: 2,
        numres: 5,
        url: url,
        api_key: apiKey,
      });

      return SauceNaoResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `SauceNAO error: ${(error as Error).message}`
      );
    }
  }
}
