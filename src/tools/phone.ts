import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class PhoneApiClient extends BaseApiClient {
  protected baseUrl = "https://phonevalidation.abstractapi.com/v1/";

  constructor() {
    super(10);
  }

  async lookup(number: string): Promise<any> {
    const apiKey = process.env.ABSTRACT_PHONE_API_KEY;
    if (!apiKey) {
      // Fallback to basic formatting if no key
      return {
        number,
        message: "Configure ABSTRACT_PHONE_API_KEY for full carrier/location data",
        basicFormat: true
      };
    }

    try {
      return await this.fetch<any>("", {
        method: "GET",
      }, {
        api_key: apiKey,
        phone: number,
      });
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Phone Lookup error: ${(error as Error).message}`);
    }
  }
}
