import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class ArchiveApiClient extends BaseApiClient {
  protected baseUrl = "https://archive.org/wayback/available";

  constructor() {
    super(30);
  }

  async getLatestSnapshot(url: string): Promise<any> {
    try {
      const data = await this.fetch<any>("", {
        method: "GET",
      }, {
        url: url,
      });

      const snapshot = data.archived_snapshots?.closest;
      if (!snapshot || !snapshot.available) {
        return { available: false, message: "No snapshots found for this URL" };
      }

      return {
        available: true,
        url: snapshot.url,
        timestamp: snapshot.timestamp,
        status: snapshot.status
      };
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `Wayback Machine error: ${(error as Error).message}`);
    }
  }
}
