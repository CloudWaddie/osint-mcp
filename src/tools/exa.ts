import { BaseApiClient } from "../lib/api-client.js";
import { SearchResult, SearchResultSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";
import { z } from "zod";

export class ExaApiClient extends BaseApiClient {
  protected baseUrl = "https://api.exa.ai/";

  constructor() {
    // Exa rate limit varies by tier, let's assume a reasonable default
    super(60);
  }

  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    const apiKey = configManager.get("EXA_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "EXA_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>("search", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          numResults: limit,
          useAutoprompt: true,
        }),
      });

      const results = data.results || [];

      return z.array(SearchResultSchema).parse(results.map((r: any) => ({
        title: r.title || "Untitled",
        url: r.url,
        text: r.text || "",
        score: r.score,
        publishedDate: r.publishedDate,
        author: r.author,
      })));
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Exa Search error: ${(error as Error).message}`
      );
    }
  }
}
