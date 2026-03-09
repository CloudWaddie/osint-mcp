import { BaseApiClient } from "../lib/api-client.js";
import { DnsResult, DnsResultSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class RobtexApiClient extends BaseApiClient {
  protected baseUrl = "https://freeapi.robtex.com/";

  constructor() {
    super(60);
  }

  async getDns(domain: string): Promise<DnsResult> {
    try {
      const data = await this.fetch<any>(`pdns/forward/${domain}`, {
        method: "GET",
      });

      const records = data.map((r: any) => ({
        type: r.rrtype,
        value: r.rrdata,
      }));

      return DnsResultSchema.parse({
        domain,
        records,
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Robtex DNS error: ${(error as Error).message}`
      );
    }
  }
}
