import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export const SslCertificateSchema = z.object({
  issuer_ca_id: z.number(),
  issuer_name: z.string(),
  common_name: z.string(),
  name_value: z.string(),
  id: z.number(),
  entry_timestamp: z.string().optional(),
  not_before: z.string().optional(),
  not_after: z.string().optional(),
  serial_number: z.string().optional(),
});

export type SslCertificate = z.infer<typeof SslCertificateSchema>;

export class CrtShApiClient extends BaseApiClient {
  protected baseUrl = "https://crt.sh/";

  constructor() {
    // crt.sh can be slow, let's be patient but limited
    super(20);
  }

  async getCertificates(query: string): Promise<SslCertificate[]> {
    try {
      const data = await this.fetch<any[]>("", {
        method: "GET",
      }, {
        q: query,
        output: "json",
      });

      if (!Array.isArray(data)) return [];

      return z.array(SslCertificateSchema).parse(data);
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `crt.sh SSL lookup error: ${(error as Error).message}`
      );
    }
  }
}
