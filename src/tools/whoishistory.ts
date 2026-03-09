import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class WhoisXmlApiClient extends BaseApiClient {
  protected baseUrl = "https://whois-history.whoisxmlapi.com/api/v1";

  constructor() {
    super(10);
  }

  async getHistory(domain: string): Promise<any> {
    const apiKey = process.env.WHOISXML_API_KEY;
    if (!apiKey) {
      throw new McpError(ErrorCode.InvalidRequest, "WHOISXML_API_KEY is not configured");
    }

    try {
      return await this.fetch<any>("", {
        method: "GET",
      }, {
        apiKey: apiKey,
        domainName: domain,
      });
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `WHOIS History error: ${(error as Error).message}`);
    }
  }
}
