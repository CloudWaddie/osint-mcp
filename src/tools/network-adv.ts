import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class NetworkAdvClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  // ASN & BGP Data via BGPView
  async lookupAsn(asn: string): Promise<any> {
    try {
      const response = await fetch(`https://api.bgpview.io/asn/${asn}`);
      return await response.json();
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `ASN Lookup error: ${(error as Error).message}`);
    }
  }

  // URL Unshortener (Follows redirects to find final destination)
  async unshorten(url: string): Promise<any> {
    try {
      const response = await fetch(url, { redirect: 'manual', method: 'HEAD' });
      const location = response.headers.get('location');
      return {
        shortUrl: url,
        destination: location || url,
        isRedirect: !!location,
        status: response.status
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Unshorten error: ${(error as Error).message}`);
    }
  }

  // Quick Port Scan (HackerTarget free API)
  async scanPorts(ip: string): Promise<string> {
    try {
      const response = await fetch(`https://api.hackertarget.com/nmap/?q=${ip}`);
      return await response.text();
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Port Scan error: ${(error as Error).message}`);
    }
  }
}
