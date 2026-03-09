import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export const GoogleVisionResultSchema = z.object({
  responses: z.array(z.any()),
});

export type GoogleVisionResult = z.infer<typeof GoogleVisionResultSchema>;

export class GoogleVisionApiClient extends BaseApiClient {
  protected baseUrl = "https://vision.googleapis.com/v1/";

  constructor() {
    // Google Vision API is pay-per-use, but has free monthly quotas
    super(60);
  }

  async annotateImage(imageUrl: string): Promise<GoogleVisionResult> {
    const apiKey = configManager.get("GOOGLE_CLOUD_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "GOOGLE_CLOUD_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>("images:annotate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: {
                  imageUri: imageUrl,
                },
              },
              features: [
                { type: "LABEL_DETECTION", maxResults: 10 },
                { type: "TEXT_DETECTION" },
                { type: "WEB_DETECTION" },
                { type: "LANDMARK_DETECTION" },
              ],
            },
          ],
        }),
      }, {
        key: apiKey,
      });

      return GoogleVisionResultSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Google Vision error: ${(error as Error).message}`
      );
    }
  }
}
