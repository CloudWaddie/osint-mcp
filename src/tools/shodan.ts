import { BaseApiClient } from "../lib/api-client.js";
import { ShodanHost, ShodanHostSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { configManager } from "../lib/config.js";

export class ShodanApiClient extends BaseApiClient {
  protected baseUrl = "https://api.shodan.io/";

  constructor() {
    // Shodan rate limit is usually 1 request per second for basic API
    super(60);
  }

  async getHost(ip: string): Promise<ShodanHost> {
    const apiKey = configManager.get("SHODAN_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "SHODAN_API_KEY is not configured"
      );
    }

    try {
      const data = await this.fetch<any>(`shodan/host/${ip}`, {
        method: "GET",
      }, {
        key: apiKey,
      });

      return ShodanHostSchema.parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Shodan error: ${(error as Error).message}`
      );
    }
  }

  async getWhois(ip: string): Promise<any> {
    const apiKey = configManager.get("SHODAN_API_KEY");
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "SHODAN_API_KEY is not configured"
      );
    }

    try {
      // Shodan has a labs/whois endpoint but it's for domains usually.
      // For IP whois, shodan/host/{ip} already contains some info.
      // Let's use the dedicated labs/whois if it supports IP, or just stick to host.
      const data = await this.fetch<any>(`labs/whois`, {
        method: "GET",
      }, {
        key: apiKey,
        query: ip
      });

      return data;
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Shodan WHOIS error: ${(error as Error).message}`
      );
    }
  }
}
