import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class MacAddressApiClient extends BaseApiClient {
  protected baseUrl = "https://api.macvendors.com/";

  constructor() {
    // MacVendors free tier: 1 request every 1 second
    super(60);
  }

  async getVendor(mac: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}${encodeURIComponent(mac)}`);
      if (response.status === 404) {
        return "Unknown Vendor";
      }
      if (!response.ok) {
        throw new Error(`API failed: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `MAC Address Lookup error: ${(error as Error).message}`);
    }
  }
}
