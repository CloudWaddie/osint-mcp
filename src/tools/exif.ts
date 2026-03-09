import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class ExifApiClient extends BaseApiClient {
  protected baseUrl = "https://api.exif.sh/api/v1/";

  constructor() {
    super(20);
  }

  async getMetadata(imageUrl: string): Promise<any> {
    try {
      // Some public EXIF APIs allow simple URL submission
      const response = await fetch(`${this.baseUrl}url?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) throw new Error("Could not extract EXIF from this image");
      return await response.json();
    } catch (error) {
      // Fallback message if service is down
      return {
        error: true,
        message: "EXIF extraction failed. Image might have no metadata or service is unavailable.",
        details: (error as Error).message
      };
    }
  }
}
