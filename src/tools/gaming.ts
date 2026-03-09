import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class GamingApiClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  // Discord via Lanyard (No key needed for presence/profile if they use Lanyard)
  async discordLookup(userId: string): Promise<any> {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      if (!response.ok) {
        return { message: "User not found or not on Lanyard. Consider using a Discord Bot token for direct lookups." };
      }
      const data = await response.json() as any;
      return data.data;
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Discord Lookup error: ${(error as Error).message}`);
    }
  }

  // Steam Web API (Requires STEAM_API_KEY)
  async steamLookup(steamId: string): Promise<any> {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) throw new McpError(ErrorCode.InvalidRequest, "STEAM_API_KEY is not configured");

    try {
      const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`);
      const data = await response.json() as any;
      return data.response?.players?.[0] || { message: "Player not found" };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Steam Lookup error: ${(error as Error).message}`);
    }
  }

  // Xbox via OpenXBL (Requires OPENXBL_API_KEY)
  async xboxLookup(gt: string): Promise<any> {
    const apiKey = process.env.OPENXBL_API_KEY;
    if (!apiKey) throw new McpError(ErrorCode.InvalidRequest, "OPENXBL_API_KEY is not configured");

    try {
      const response = await fetch(`https://xbl.io/api/v2/search/${encodeURIComponent(gt)}`, {
        headers: { "X-Authorization": apiKey }
      });
      return await response.json();
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Xbox Lookup error: ${(error as Error).message}`);
    }
  }
}
