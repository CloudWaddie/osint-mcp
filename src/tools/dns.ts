import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dns from "node:dns/promises";

export class DirectDnsClient {
  async lookup(domain: string, type: "A" | "AAAA" | "MX" | "TXT" | "NS" | "CNAME" | "SOA" | "PTR"): Promise<any> {
    try {
      switch (type) {
        case "A": return await dns.resolve4(domain);
        case "AAAA": return await dns.resolve6(domain);
        case "MX": return await dns.resolveMx(domain);
        case "TXT": return await dns.resolveTxt(domain);
        case "NS": return await dns.resolveNs(domain);
        case "CNAME": return await dns.resolveCname(domain);
        case "SOA": return await dns.resolveSoa(domain);
        default: throw new Error(`Unsupported record type: ${type}`);
      }
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `DNS Lookup failed: ${(error as Error).message}`);
    }
  }

  async reverse(ip: string): Promise<string[]> {
    try {
      return await dns.reverse(ip);
    } catch (error) {
       throw new McpError(ErrorCode.InternalError, `Reverse DNS failed: ${(error as Error).message}`);
    }
  }
}
