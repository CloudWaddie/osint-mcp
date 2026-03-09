import { BaseApiClient } from "../lib/api-client.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const PLATFORMS = [
  { name: "Twitter", url: "https://twitter.com/{}" },
  { name: "Facebook", url: "https://www.facebook.com/{}" },
  { name: "Instagram", url: "https://www.instagram.com/{}/" },
  { name: "Reddit", url: "https://www.reddit.com/user/{}" },
  { name: "YouTube", url: "https://www.youtube.com/@{}" },
  { name: "Pinterest", url: "https://www.pinterest.com/{}/" },
  { name: "GitHub", url: "https://www.github.com/{}" },
  { name: "Medium", url: "https://medium.com/@{}" },
  { name: "Dev.to", url: "https://dev.to/{}" },
  { name: "Keybase", url: "https://keybase.io/{}" },
  { name: "Steam", url: "https://steamcommunity.com/id/{}" },
  { name: "Twitch", url: "https://www.twitch.tv/{}" },
  { name: "SoundCloud", url: "https://soundcloud.com/{}" },
  { name: "GitLab", url: "https://gitlab.com/{}" },
  { name: "About.me", url: "https://about.me/{}" },
  { name: "SlideShare", url: "https://www.slideshare.net/{}" },
  { name: "WordPress", url: "https://{}.wordpress.com/" },
  { name: "Blogger", url: "https://{}.blogspot.com/" },
  { name: "Linktree", url: "https://linktr.ee/{}" },
  { name: "Venmo", url: "https://venmo.com/{}" },
];

export class UsernameSearchClient extends BaseApiClient {
  protected baseUrl = "";

  constructor() {
    super(60);
  }

  async search(username: string): Promise<any[]> {
    const results: any[] = [];
    const timeout = 5000;

    // Run searches in parallel with a concurrency limit
    const checkPlatform = async (platform: any) => {
      const url = platform.url.replace("{}", username);
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, { 
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        
        clearTimeout(id);
        
        if (response.status === 200) {
          results.push({
            platform: platform.name,
            url: url,
            status: "found"
          });
        }
      } catch (error) {
        // Ignore errors, just means it's likely not found or blocked
      }
    };

    // Parallel execution with small batches to avoid being blocked
    const batchSize = 5;
    for (let i = 0; i < PLATFORMS.length; i += batchSize) {
      const batch = PLATFORMS.slice(i, i + batchSize);
      await Promise.all(batch.map(p => checkPlatform(p)));
    }

    return results;
  }
}
