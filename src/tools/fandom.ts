import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class FandomApiClient extends BaseApiClient {
  protected baseUrl = "https://community.fandom.com/api.php";

  constructor() {
    super(30);
  }

  async getUserInfo(username: string): Promise<any> {
    try {
      const data = await this.fetch<any>("", {
        method: "GET",
      }, {
        action: "query",
        list: "users",
        ususers: username,
        usprop: "blockinfo|groups|editcount|registration|gender",
        format: "json",
      });

      return data.query?.users?.[0] || null;
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `Fandom User Info error: ${(error as Error).message}`);
    }
  }

  async getUserContributions(username: string, limit: number = 50): Promise<any[]> {
    try {
      const data = await this.fetch<any>("", {
        method: "GET",
      }, {
        action: "query",
        list: "usercontribs",
        ucuser: username,
        uclimit: limit,
        format: "json",
      });

      return data.query?.usercontribs || [];
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `Fandom Contributions error: ${(error as Error).message}`);
    }
  }
}
