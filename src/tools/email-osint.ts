import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class EmailOsintClient {
  generatePermutations(firstName: string, lastName: string, domain: string): string[] {
    const fn = firstName.toLowerCase().trim();
    const ln = lastName.toLowerCase().trim();
    const fi = fn[0];
    const li = ln[0];
    const d = domain.toLowerCase().trim();

    const patterns = [
      `${fn}@${d}`,
      `${ln}@${d}`,
      `${fn}.${ln}@${d}`,
      `${fn}${ln}@${d}`,
      `${fi}${ln}@${d}`,
      `${fi}.${ln}@${d}`,
      `${fn}${li}@${d}`,
      `${fn}.${li}@${d}`,
      `${fi}${li}@${d}`,
      `${fi}.${li}@${d}`,
      `${ln}.${fn}@${d}`,
      `${ln}${fn}@${d}`,
      `${ln}${fi}@${d}`,
      `${ln}.${fi}@${d}`,
      `${fn}-${ln}@${d}`,
      `${fi}-${ln}@${d}`,
      `${fn}-${li}@${d}`,
      `${fi}-${li}@${d}`,
      `${fn}_${ln}@${d}`,
      `${fi}_${ln}@${d}`,
      `${fn}_${li}@${d}`,
      `${fi}_${li}@${d}`,
    ];

    return Array.from(new Set(patterns));
  }

  async validateFormat(email: string): Promise<boolean> {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
