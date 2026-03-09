import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class CorporateApiClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  // OpenCorporates Search (Free tier available)
  async searchCompanies(query: string): Promise<any[]> {
    const apiKey = process.env.OPENCORPORATES_API_KEY;
    // OpenCorporates works without a key but is very limited
    const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(query)}${apiKey ? `&api_token=${apiKey}` : ""}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json() as any;
      return data.results?.companies || [];
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `OpenCorporates error: ${(error as Error).message}`);
    }
  }

  // PGP Key Search (via Ubuntu Keyserver)
  async searchPgp(query: string): Promise<any> {
    try {
      const response = await fetch(`https://keyserver.ubuntu.com/pks/lookup?search=${encodeURIComponent(query)}&op=index&fingerprint=on&options=mr`);
      const text = await response.text();
      // Machine-readable format (mr) is hard to parse without a lib, but we can return raw text for the user
      return {
        query,
        rawResult: text,
        info: "Public PGP keys found for this identity."
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `PGP Search error: ${(error as Error).message}`);
    }
  }
}
