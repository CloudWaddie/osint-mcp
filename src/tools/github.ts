import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class GithubApiClient extends BaseApiClient {
  protected baseUrl = "https://api.github.com/";

  constructor() {
    // GitHub API rate limit for unauthenticated requests is 60/hr
    // But we might be using GH CLI token if available, or just be careful.
    super(60);
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "OSINT-MCP-Server",
    };
    // If user provides a GITHUB_TOKEN in env, use it
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }
    return headers;
  }

  async getUserInfo(username: string): Promise<any> {
    try {
      return await this.fetch<any>(`users/${username}`, {
        method: "GET",
        headers: this.getHeaders(),
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `GitHub User Info error: ${(error as Error).message}`);
    }
  }

  async getUserRepos(username: string): Promise<any[]> {
    try {
      return await this.fetch<any[]>(`users/${username}/repos`, {
        method: "GET",
        headers: this.getHeaders(),
      }, {
        per_page: 100,
        sort: "updated"
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `GitHub User Repos error: ${(error as Error).message}`);
    }
  }

  async getCommitEmails(username: string): Promise<string[]> {
    try {
      const events = await this.fetch<any[]>(`users/${username}/events/public`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const emails = new Set<string>();
      events.forEach((event: any) => {
        if (event.type === "PushEvent" && event.payload?.commits) {
          event.payload.commits.forEach((commit: any) => {
            if (commit.author?.email && !commit.author.email.includes("noreply")) {
              emails.add(commit.author.email);
            }
          });
        }
      });

      return Array.from(emails);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `GitHub Commit Emails error: ${(error as Error).message}`);
    }
  }
}
