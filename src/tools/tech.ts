import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export class TechDetectorClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(30);
  }

  async detect(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      const headers = Object.fromEntries(response.headers.entries());
      const html = await response.text();

      const techs = new Set<string>();

      // Check Headers
      if (headers["server"]) {
        if (headers["server"].includes("cloudflare")) techs.add("Cloudflare");
        if (headers["server"].includes("nginx")) techs.add("Nginx");
        if (headers["server"].includes("apache")) techs.add("Apache");
      }
      if (headers["x-powered-by"]) techs.add(headers["x-powered-by"]);
      if (headers["x-nextjs-cache"]) techs.add("Next.js");

      // Check HTML patterns
      if (html.includes("wp-content")) techs.add("WordPress");
      if (html.includes("_next/static")) techs.add("Next.js");
      if (html.includes("react")) techs.add("React");
      if (html.includes("vue")) techs.add("Vue.js");
      if (html.includes("google-analytics")) techs.add("Google Analytics");
      if (html.includes("tailwind")) techs.add("Tailwind CSS");
      if (html.includes("bootstrap")) techs.add("Bootstrap");

      return {
        url,
        technologies: Array.from(techs),
        headers: headers
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Tech Detector error: ${(error as Error).message}`);
    }
  }
}
