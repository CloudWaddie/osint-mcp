import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class SocialScavengerClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(20);
  }

  // Fetch Twitter/X profile via a public Nitter instance (No API Key)
  async getTwitterProfile(username: string): Promise<any> {
    try {
      // Using a reliable public nitter instance
      const response = await fetch(`https://nitter.net/${username}/rss`);
      if (!response.ok) throw new Error("Profile not found or instance down");
      const text = await response.text();

      // Basic regex extraction from RSS for bio/details
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
      const descMatch = text.match(/<description>(.*?)<\/description>/i);

      return {
        platform: "Twitter/X",
        username,
        title: titleMatch ? titleMatch[1] : "",
        bio: descMatch ? descMatch[1] : "No bio found or private account",
        url: `https://twitter.com/${username}`,
        nitterUrl: `https://nitter.net/${username}`
      };
    } catch (error) {
      return { platform: "Twitter/X", username, error: true, message: (error as Error).message };
    }
  }

  // Basic Instagram check (limited due to IG's strict blocking)
  async getInstagramProfile(username: string): Promise<any> {
    try {
      const url = `https://www.instagram.com/${username}/`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
      });
      return {
        platform: "Instagram",
        username,
        url,
        status: response.status === 200 ? "Active" : "Not Found or Blocked"
      };
    } catch (e) {
      return { platform: "Instagram", username, error: true };
    }
  }
}
