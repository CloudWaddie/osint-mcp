import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class SocialScraperClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  async scrapeMetadata(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const metadata: any = {
        title: "",
        description: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "",
        generator: "",
      };

      // Simple regex-based extraction to avoid heavy dependencies like cheerio
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) metadata.title = titleMatch[1];

      const metaMatches = html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/gi);
      for (const match of metaMatches) {
        const prop = match[1].toLowerCase();
        const content = match[2];

        if (prop === "description") metadata.description = content;
        if (prop === "og:title") metadata.ogTitle = content;
        if (prop === "og:description") metadata.ogDescription = content;
        if (prop === "og:image") metadata.ogImage = content;
        if (prop === "twitter:card") metadata.twitterCard = content;
        if (prop === "generator") metadata.generator = content;
      }

      return metadata;
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Social Scraper error: ${(error as Error).message}`);
    }
  }
}
