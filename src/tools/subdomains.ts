import { CrtShApiClient } from "./ssl.js";
import { HackerTargetApiClient } from "./hackertarget.js";

export class SubdomainFinder {
  private crtSh = new CrtShApiClient();
  private hackerTarget = new HackerTargetApiClient();

  async find(domain: string): Promise<string[]> {
    const [crtResult, htResult] = await Promise.allSettled([
      this.crtSh.getCertificates(domain),
      this.hackerTarget.getSubdomains(domain),
    ]);

    const subdomains = new Set<string>();

    if (crtResult.status === "fulfilled") {
      crtResult.value.forEach(cert => {
        cert.name_value.split("\n").forEach(name => {
          const cleaned = name.trim().toLowerCase();
          if (cleaned.endsWith(domain)) {
            subdomains.add(cleaned);
          }
        });
      });
    }

    if (htResult.status === "fulfilled") {
      htResult.value.forEach(item => {
        subdomains.add(item.domain.toLowerCase());
      });
    }

    return Array.from(subdomains).sort();
  }
}
