import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { configManager } from "./lib/config.js";
import { z } from "zod";

// Import API clients
import { IpApiClient } from "./tools/ip-geolocation.js";
import { RdapApiClient } from "./tools/whois.js";
import { RobtexApiClient } from "./tools/robtex.js";
import { HibpApiClient } from "./tools/hibp.js";
import { ShodanApiClient } from "./tools/shodan.js";
import { ExaApiClient } from "./tools/exa.js";
import { CrtShApiClient } from "./tools/ssl.js";
import { VirusTotalApiClient } from "./tools/virustotal.js";
import { HackerTargetApiClient } from "./tools/hackertarget.js";
import { SubdomainFinder } from "./tools/subdomains.js";
import { HunterApiClient } from "./tools/hunter.js";
import { GreyNoiseApiClient } from "./tools/greynoise.js";
import { OtxApiClient } from "./tools/otx.js";
import { SecurityTrailsApiClient } from "./tools/securitytrails.js";
import { ZoomEyeApiClient } from "./tools/zoomeye.js";
import { SauceNaoApiClient } from "./tools/saucenao.js";
import { ImaggaApiClient } from "./tools/imagga.js";
import { GoogleVisionApiClient } from "./tools/googlevision.js";
import { GithubApiClient } from "./tools/github.js";
import { UsernameSearchClient } from "./tools/usernames.js";
import { FandomApiClient } from "./tools/fandom.js";
import { ArchiveApiClient } from "./tools/archive.js";
import { MacAddressApiClient } from "./tools/mac.js";
import { KeybaseApiClient } from "./tools/keybase.js";
import { DirectDnsClient } from "./tools/dns.js";
import { SocialScraperClient } from "./tools/social.js";
import { TechDetectorClient } from "./tools/tech.js";
import { RedditApiClient } from "./tools/reddit.js";
import { WhoisXmlApiClient } from "./tools/whoishistory.js";
import { EmailOsintClient } from "./tools/email-osint.js";
import { EmailSearchClient } from "./tools/email-search.js";
import { SocialAccountClient } from "./tools/social-accounts.js";
import { CryptoApiClient } from "./tools/crypto.js";
import { PhoneApiClient } from "./tools/phone.js";
import { ExifApiClient } from "./tools/exif.js";
import { GamingApiClient } from "./tools/gaming.js";
import { ThreatIntelClient } from "./tools/threat.js";
import { NetworkAdvClient } from "./tools/network-adv.js";
import { CorporateApiClient } from "./tools/corporate.js";
import { SocialScavengerClient } from "./tools/social-scavenger.js";

const server = new McpServer({
  name: "osint-mcp",
  version: "1.0.0",
});

// Initialize API clients
const ipClient = new IpApiClient();
const whoisClient = new RdapApiClient();
const robtexClient = new RobtexApiClient();
const hibpClient = new HibpApiClient();
const shodanClient = new ShodanApiClient();
const exaClient = new ExaApiClient();
const sslClient = new CrtShApiClient();
const vtClient = new VirusTotalApiClient();
const htClient = new HackerTargetApiClient();
const subFinder = new SubdomainFinder();
const hunterClient = new HunterApiClient();
const gnClient = new GreyNoiseApiClient();
const otxClient = new OtxApiClient();
const stClient = new SecurityTrailsApiClient();
const zeClient = new ZoomEyeApiClient();
const snClient = new SauceNaoApiClient();
const imClient = new ImaggaApiClient();
const gvClient = new GoogleVisionApiClient();
const ghClient = new GithubApiClient();
const userClient = new UsernameSearchClient();
const fandomClient = new FandomApiClient();
const archiveClient = new ArchiveApiClient();
const macClient = new MacAddressApiClient();
const keybaseClient = new KeybaseApiClient();
const directDnsClient = new DirectDnsClient();
const socialClient = new SocialScraperClient();
const techClient = new TechDetectorClient();
const redditClient = new RedditApiClient();
const whoisHistoryClient = new WhoisXmlApiClient();
const emailOsintClient = new EmailOsintClient();
const emailSearchClient = new EmailSearchClient();
const emailSocialClient = new SocialAccountClient();
const cryptoClient = new CryptoApiClient();
const phoneClient = new PhoneApiClient();
const exifClient = new ExifApiClient();
const gamingClient = new GamingApiClient();
const threatClient = new ThreatIntelClient();
const netAdvClient = new NetworkAdvClient();
const corpClient = new CorporateApiClient();
const scavengerClient = new SocialScavengerClient();

// --- IP Geolocation ---
server.tool(
  "ip_geolocation",
  { ip: z.string().describe("IP address to geolocate") },
  async ({ ip }) => {
    const result = await ipClient.getLocation(ip);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- WHOIS ---
server.tool(
  "whois_lookup",
  { domain: z.string().describe("Domain name to lookup WHOIS information") },
  async ({ domain }) => {
    const result = await whoisClient.getWhois(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "whois_history",
  { domain: z.string().describe("Domain name to lookup WHOIS history (Requires WHOISXML_API_KEY)") },
  async ({ domain }) => {
    const result = await whoisHistoryClient.getHistory(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- DNS ---
server.tool(
  "dns_lookup_passive",
  { domain: z.string().describe("Domain name to lookup passive DNS records from Robtex") },
  async ({ domain }) => {
    const result = await robtexClient.getDns(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "dns_lookup_direct",
  {
    domain: z.string().describe("Domain name to lookup"),
    type: z.enum(["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA"]).describe("Record type"),
  },
  async ({ domain, type }) => {
    const result = await directDnsClient.lookup(domain, type);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "reverse_dns",
  { ip: z.string().describe("IP address to lookup hostname for") },
  async ({ ip }) => {
    const result = await directDnsClient.reverse(ip);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- HIBP ---
server.tool(
  "check_breaches",
  { email: z.string().email().describe("Email address to check for breaches") },
  async ({ email }) => {
    const result = await hibpClient.checkBreaches(email);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Shodan ---
server.tool(
  "shodan_host",
  { ip: z.string().describe("IP address to lookup in Shodan") },
  async ({ ip }) => {
    const result = await shodanClient.getHost(ip);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "shodan_whois",
  { query: z.string().describe("IP or domain to lookup WHOIS in Shodan Labs") },
  async ({ query }) => {
    const result = await shodanClient.getWhois(query);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- SSL ---
server.tool(
  "ssl_certs",
  { domain: z.string().describe("Domain name to lookup SSL certificates on crt.sh") },
  async ({ domain }) => {
    const result = await sslClient.getCertificates(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- VirusTotal ---
server.tool(
  "url_reputation",
  { url: z.string().url().describe("URL to check reputation on VirusTotal") },
  async ({ url }) => {
    const result = await vtClient.getUrlReputation(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- DNS Enumeration ---
server.tool(
  "dns_enumeration",
  { domain: z.string().describe("Domain name for DNS enumeration") },
  async ({ domain }) => {
    const result = await htClient.getDnsLookup(domain);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

// --- Subdomain Enumeration ---
server.tool(
  "subdomain_enum",
  { domain: z.string().describe("Domain name to find subdomains") },
  async ({ domain }) => {
    const result = await subFinder.find(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Hunter.io ---
server.tool(
  "hunter_domain_search",
  { domain: z.string().describe("Domain to search for email addresses") },
  async ({ domain }) => {
    const result = await hunterClient.domainSearch(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- GreyNoise ---
server.tool(
  "greynoise_ip_context",
  { ip: z.string().describe("IP address to check context in GreyNoise") },
  async ({ ip }) => {
    const result = await gnClient.getIpContext(ip);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- AlienVault OTX ---
server.tool(
  "otx_indicator_details",
  {
    type: z.enum(["IPv4", "domain", "hostname"]).describe("Type of indicator"),
    indicator: z.string().describe("Indicator to lookup (IP, domain, etc.)"),
  },
  async ({ type, indicator }) => {
    const result = await otxClient.getIndicatorDetails(type, indicator);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- SecurityTrails ---
server.tool(
  "securitytrails_subdomains",
  { domain: z.string().describe("Domain to find subdomains in SecurityTrails") },
  async ({ domain }) => {
    const result = await stClient.getSubdomains(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- ZoomEye ---
server.tool(
  "zoomeye_host_search",
  { query: z.string().describe("Search query for ZoomEye (e.g., 'port:80')") },
  async ({ query }) => {
    const result = await zeClient.searchHost(query);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- SauceNAO ---
server.tool(
  "reverse_image_search_anime",
  { url: z.string().url().describe("Image URL to search on SauceNAO") },
  async ({ url }) => {
    const result = await snClient.searchUrl(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Imagga ---
server.tool(
  "image_tagging",
  { url: z.string().url().describe("Image URL to tag using Imagga") },
  async ({ url }) => {
    const result = await imClient.tagImageUrl(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Google Vision ---
server.tool(
  "google_vision_analyze",
  { url: z.string().url().describe("Image URL to analyze with Google Vision API") },
  async ({ url }) => {
    const result = await gvClient.annotateImage(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- GitHub ---
server.tool(
  "github_user_info",
  { username: z.string().describe("GitHub username") },
  async ({ username }) => {
    const result = await ghClient.getUserInfo(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "github_user_repos",
  { username: z.string().describe("GitHub username") },
  async ({ username }) => {
    const result = await ghClient.getUserRepos(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "github_commit_emails",
  { username: z.string().describe("GitHub username") },
  async ({ username }) => {
    const result = await ghClient.getCommitEmails(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "github_repo_commits",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
  },
  async ({ owner, repo }) => {
    const result = await ghClient.getRepoCommits(owner, repo);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Username Search ---
server.tool(
  "username_search",
  { username: z.string().describe("Username to search for across platforms") },
  async ({ username }) => {
    const result = await userClient.search(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Fandom ---
server.tool(
  "fandom_user_info",
  { username: z.string().describe("Fandom username") },
  async ({ username }) => {
    const result = await fandomClient.getUserInfo(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "fandom_user_contributions",
  { 
    username: z.string().describe("Fandom username"),
    limit: z.number().optional().default(50).describe("Number of contributions to return"),
  },
  async ({ username, limit }) => {
    const result = await fandomClient.getUserContributions(username, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Wayback Machine ---
server.tool(
  "archive_org_snapshot",
  { url: z.string().url().describe("URL to check for Wayback Machine snapshots") },
  async ({ url }) => {
    const result = await archiveClient.getLatestSnapshot(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- MAC Address ---
server.tool(
  "mac_lookup",
  { mac: z.string().describe("MAC address to lookup vendor for") },
  async ({ mac }) => {
    const result = await macClient.getVendor(mac);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

// --- Keybase ---
server.tool(
  "keybase_lookup",
  { username: z.string().describe("Keybase username to lookup") },
  async ({ username }) => {
    const result = await keybaseClient.lookup(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Reddit ---
server.tool(
  "reddit_user_details",
  { username: z.string().describe("Reddit username") },
  async ({ username }) => {
    const result = await redditClient.getUserDetails(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "reddit_user_posts",
  {
    username: z.string().describe("Reddit username"),
    limit: z.number().optional().default(25).describe("Number of posts to return"),
  },
  async ({ username, limit }) => {
    const result = await redditClient.getUserPosts(username, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Social & Tech ---
server.tool(
  "url_metadata",
  { url: z.string().url().describe("URL to scrape metadata from") },
  async ({ url }) => {
    const result = await socialClient.scrapeMetadata(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "url_tech_stack",
  { url: z.string().url().describe("URL to detect technology stack for") },
  async ({ url }) => {
    const result = await techClient.detect(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Email OSINT ---
server.tool(
  "email_permutator",
  {
    firstName: z.string().describe("First name"),
    lastName: z.string().describe("Last name"),
    domain: z.string().describe("Domain (e.g., example.com)"),
  },
  async ({ firstName, lastName, domain }) => {
    const result = emailOsintClient.generatePermutations(firstName, lastName, domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "domain_email_search",
  { domain: z.string().describe("Domain to search for associated emails") },
  async ({ domain }) => {
    const result = await emailSearchClient.searchDomain(domain);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "email_social_check",
  { email: z.string().email().describe("Email to check for social profiles") },
  async ({ email }) => {
    const result = await emailSocialClient.checkEmail(email);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Crypto & Phone & EXIF ---
server.tool(
  "btc_lookup",
  { address: z.string().describe("Bitcoin address to lookup") },
  async ({ address }) => {
    const result = await cryptoClient.lookupBtc(address);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "eth_lookup",
  { address: z.string().describe("Ethereum address to lookup") },
  async ({ address }) => {
    const result = await cryptoClient.lookupEth(address);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "phone_lookup",
  { number: z.string().describe("Phone number to lookup (include country code)") },
  async ({ number }) => {
    const result = await phoneClient.lookup(number);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "exif_metadata",
  { url: z.string().url().describe("Image URL to extract EXIF data from") },
  async ({ url }) => {
    const result = await exifClient.getMetadata(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Gaming ---
server.tool(
  "discord_lookup",
  { userId: z.string().describe("Discord User ID to lookup") },
  async ({ userId }) => {
    const result = await gamingClient.discordLookup(userId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "steam_lookup",
  { steamId: z.string().describe("Steam ID to lookup (64-bit ID)") },
  async ({ steamId }) => {
    const result = await gamingClient.steamLookup(steamId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "xbox_lookup",
  { gamertag: z.string().describe("Xbox Gamertag to lookup") },
  async ({ gamertag }) => {
    const result = await gamingClient.xboxLookup(gamertag);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Threat Intel ---
server.tool(
  "hash_lookup",
  { hash: z.string().describe("MD5/SHA1/SHA256 hash to lookup in MalwareBazaar") },
  async ({ hash }) => {
    const result = await threatClient.lookupHash(hash);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "tor_check",
  { ip: z.string().describe("IP address to check for Tor node status") },
  async ({ ip }) => {
    const result = await threatClient.isTorNode(ip);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "paste_search",
  { query: z.string().describe("Query to search for in public pastes") },
  async ({ query }) => {
    const result = await threatClient.searchPastes(query);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Advanced Network ---
server.tool(
  "asn_lookup",
  { asn: z.string().describe("ASN string (e.g., '15169') to lookup") },
  async ({ asn }) => {
    const result = await netAdvClient.lookupAsn(asn);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "unshorten_url",
  { url: z.string().url().describe("Shortened URL to expand") },
  async ({ url }) => {
    const result = await netAdvClient.unshorten(url);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "quick_port_scan",
  { ip: z.string().describe("IP address to perform a quick port scan on") },
  async ({ ip }) => {
    const result = await netAdvClient.scanPorts(ip);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

// --- Corporate & PGP ---
server.tool(
  "opencorporates_search",
  { query: z.string().describe("Company name to search for in OpenCorporates") },
  async ({ query }) => {
    const result = await corpClient.searchCompanies(query);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "pgp_search",
  { query: z.string().describe("Email or name to search for in PGP keyservers") },
  async ({ query }) => {
    const result = await corpClient.searchPgp(query);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Social Scavenger ---
server.tool(
  "twitter_user_search",
  { username: z.string().describe("Twitter/X username to lookup") },
  async ({ username }) => {
    const result = await scavengerClient.getTwitterProfile(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "instagram_user_lookup",
  { username: z.string().describe("Instagram username to lookup") },
  async ({ username }) => {
    const result = await scavengerClient.getInstagramProfile(username);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// --- Exa Search ---
server.tool(
  "web_search",
  {
    query: z.string().describe("Search query"),
    limit: z.number().optional().default(5).describe("Number of results to return"),
  },
  async ({ query, limit }) => {
    const result = await exaClient.search(query, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

async function main() {
  const isStdio = process.argv.includes("--stdio") || !process.stdout.isTTY;
  const isHttp = process.argv.includes("--http") || !isStdio;

  if (isStdio) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("OSINT MCP Server running on stdio");
  }

  if (isHttp) {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const PORT = configManager.get("PORT");
    const HOST = configManager.get("HOST");

    app.post("/mcp", async (req, res) => {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => Math.random().toString(36).substring(2),
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    });

    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.listen(PORT, HOST, () => {
      console.error(`OSINT MCP Server running on http://${HOST}:${PORT}/mcp`);
    });
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
