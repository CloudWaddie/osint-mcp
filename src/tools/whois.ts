import { BaseApiClient } from "../lib/api-client.js";
import { WhoisResult, WhoisResultSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class RdapApiClient extends BaseApiClient {
  // Use rdap.org which redirects to the correct RDAP server
  protected baseUrl = "https://rdap.org/domain/";

  constructor() {
    // Be conservative with RDAP rate limits
    super(30);
  }

  async getWhois(domain: string): Promise<WhoisResult> {
    try {
      const data = await this.fetch<any>(domain, {
        method: "GET",
      });

      // RDAP response format varies significantly between registrars
      // This is a basic mapping, focusing on common fields
      const registrar = data.entities?.find((e: any) => e.roles?.includes("registrar"))?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3];
      
      const events = data.events || [];
      const registrationDate = events.find((e: any) => e.eventAction === "registration")?.eventDate;
      const expirationDate = events.find((e: any) => e.eventAction === "expiration")?.eventDate;
      
      const nameServers = data.nameservers?.map((ns: any) => ns.ldhName) || [];

      return WhoisResultSchema.parse({
        domain,
        registrar: registrar || "Unknown",
        registrationDate,
        expirationDate,
        nameServers,
        status: data.status,
        raw: data,
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `RDAP WHOIS error: ${(error as Error).message}`
      );
    }
  }
}
