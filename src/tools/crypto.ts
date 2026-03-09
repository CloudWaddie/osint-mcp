import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class CryptoApiClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  async lookupBtc(address: string): Promise<any> {
    try {
      const response = await fetch(`https://blockchain.info/rawaddr/${address}`);
      if (!response.ok) throw new Error("BTC Address not found or API error");
      const data = await response.json() as any;
      
      return {
        address: data.address,
        totalReceived: data.total_received / 100000000,
        totalSent: data.total_sent / 100000000,
        finalBalance: data.final_balance / 100000000,
        nTx: data.n_tx,
        recentTransactions: data.txs?.slice(0, 5).map((tx: any) => ({
          hash: tx.hash,
          time: new Date(tx.time * 1000).toISOString(),
          result: tx.result / 100000000
        }))
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `BTC Lookup error: ${(error as Error).message}`);
    }
  }

  async lookupEth(address: string): Promise<any> {
    try {
      // Using BlockCypher for ETH (free tier)
      const response = await fetch(`https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`);
      if (!response.ok) throw new Error("ETH Address not found or API error");
      const data = await response.json() as any;

      return {
        address: data.address,
        totalReceived: data.total_received / 1e18,
        totalSent: data.total_sent / 1e18,
        balance: data.balance / 1e18,
        nTx: data.n_tx,
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `ETH Lookup error: ${(error as Error).message}`);
    }
  }
}
