import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const ImaggaResultSchema = z.object({
  result: z.object({
    tags: z.array(z.object({
      confidence: z.number(),
      tag: z.object({
        en: z.string(),
      }),
    })),
  }),
});

export type ImaggaResult = z.infer<typeof ImaggaResultSchema>;

export class ImaggaApiClient extends BaseApiClient {
  protected baseUrl = "https://api.imagga.com/v2/";

  constructor() {
    // Imagga free tier
    super(10);
  }

  async tagImageUrl(imageUrl: string): Promise<ImaggaResult> {
    const apiKey = configManager.get("IMAGGA_API_KEY");
    const apiSecret = configManager.get("IMAGGA_API_SECRET");
    
    if (!apiKey || !apiSecret) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "IMAGGA_API_KEY or IMAGGA_API_SECRET is not configured"
      );
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    try {
      const data = await this.fetch<any>("tags", {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }, {
        image_url: imageUrl,
      });

      return ImaggaResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Imagga error: ${(error as Error).message}`
      );
    }
  }
}
