import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class RedditApiClient extends BaseApiClient {
  protected baseUrl = "https://www.reddit.com/";

  constructor() {
    super(30);
  }

  async getUserDetails(username: string): Promise<any> {
    try {
      const data = await this.fetch<any>(`user/${username}/about.json`, {
        method: "GET",
        headers: {
          "User-Agent": "OSINT-MCP-Server/1.0.0"
        }
      });

      if (data.error) {
        throw new Error(data.message || "User not found");
      }

      const user = data.data;
      return {
        username: user.name,
        id: user.id,
        created: new Date(user.created_utc * 1000).toISOString(),
        karma: {
          total: user.total_karma,
          link: user.link_karma,
          comment: user.comment_karma
        },
        isGold: user.is_gold,
        isMod: user.is_mod,
        hasVerifiedEmail: user.has_verified_email,
        description: user.public_description
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Reddit error: ${(error as Error).message}`);
    }
  }

  async getUserPosts(username: string, limit: number = 25): Promise<any[]> {
    try {
      const data = await this.fetch<any>(`user/${username}/submitted.json`, {
        method: "GET",
        headers: {
          "User-Agent": "OSINT-MCP-Server/1.0.0"
        }
      }, {
        limit: limit
      });

      return data.data?.children?.map((p: any) => ({
        title: p.data.title,
        subreddit: p.data.subreddit,
        url: `https://reddit.com${p.data.permalink}`,
        created: new Date(p.data.created_utc * 1000).toISOString(),
        score: p.data.score
      })) || [];
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Reddit Posts error: ${(error as Error).message}`);
    }
  }
}
