import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class KeybaseApiClient extends BaseApiClient {
  protected baseUrl = "https://keybase.io/_/api/1.0/user/lookup.json";

  constructor() {
    super(60);
  }

  async lookup(username: string): Promise<any> {
    try {
      const data = await this.fetch<any>("", {
        method: "GET",
      }, {
        usernames: username,
      });

      if (data.status.code !== 0 || !data.them?.[0]) {
        return { found: false, message: "User not found" };
      }

      const user = data.them[0];
      const proofs = user.proofs_summary?.all || [];
      const linkedAccounts = proofs.map((p: any) => ({
        type: p.proof_type,
        username: p.nametag,
        url: p.service_url,
        state: p.state
      }));

      return {
        found: true,
        id: user.id,
        username: user.basics?.username,
        fullName: user.profile?.full_name,
        location: user.profile?.location,
        bio: user.profile?.bio,
        linkedAccounts: linkedAccounts,
        publicKeys: user.public_keys
      };
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(ErrorCode.InternalError, `Keybase error: ${(error as Error).message}`);
    }
  }
}
