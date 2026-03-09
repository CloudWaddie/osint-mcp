import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class ThreatIntelClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  // MalwareBazaar (Free, no key needed for simple hash lookups)
  async lookupHash(hash: string): Promise<any> {
    try {
      const response = await fetch("https://mb-api.abuse.ch/api/v1/", {
        method: "POST",
        body: new URLSearchParams({
          query: "get_info",
          hash: hash
        })
      });
      return await response.json();
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Hash Lookup error: ${(error as Error).message}`);
    }
  }

  // Tor Node Check (Check if IP is a known exit node)
  async isTorNode(ip: string): Promise<any> {
    try {
      const response = await fetch(`https://onionoo.torproject.org/details?search=${ip}`);
      const data = await response.json() as any;
      const isExit = data.relays?.some((r: any) => r.exit_policy_summary);
      return {
        ip,
        isTorNode: data.relays?.length > 0,
        isExitNode: isExit || false,
        details: data.relays?.[0]
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Tor Check error: ${(error as Error).message}`);
    }
  }

  // Paste Search (Using a public search proxy for paste sites)
  async searchPastes(query: string): Promise<any[]> {
    try {
      // Using PSBDMP.ws (Public API for Pastebin)
      const response = await fetch(`https://psbdmp.ws/api/search/${encodeURIComponent(query)}`);
      return await response.json() as any[];
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Paste Search error: ${(error as Error).message}`);
    }
  }
}
