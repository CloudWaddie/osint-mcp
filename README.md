# OSINT MCP Server

A comprehensive Model Context Protocol (MCP) server providing a wide range of OSINT (Open Source Intelligence) tools.

## Features

- **IP Intelligence**: Geolocation (ip-api.com), Shodan, GreyNoise, AlienVault OTX, MAC Address Lookup
- **Domain Intelligence**: WHOIS (RDAP, Shodan, History), DNS (Robtex, HackerTarget, Direct), SSL Certificates (crt.sh), Subdomain Enumeration, Wayback Machine (Archive.org)
- **Social & Identity**: GitHub (Profile, Repos, Commit Emails), Reddit (Profile, Posts), Fandom (Profile, Contributions), Username Search (20+ platforms), Keybase Lookup
- **Web Intelligence**: Technology Stack Detection, Social Metadata Scraping, Wayback Machine, Exa Search, VirusTotal
- **Email OSINT**: HaveIBeenPwned breach checking, Hunter.io domain search
- **Image OSINT**: Reverse Image Search (SauceNAO), Image Tagging (Imagga), Visual Analysis (Google Vision)

## Prerequisites

- Node.js 20+
- API Keys for various services (optional but recommended for full functionality)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

You can configure API keys using environment variables or a `config.json` file in the root directory.

### Example `config.json`

```json
{
  "SHODAN_API_KEY": "your_shodan_key",
  "HIBP_API_KEY": "your_hibp_key",
  "EXA_API_KEY": "your_exa_key",
  "VIRUSTOTAL_API_KEY": "your_vt_key",
  "HUNTER_API_KEY": "your_hunter_key",
  "GREYNOISE_API_KEY": "your_greynoise_key",
  "ALIENVAULT_API_KEY": "your_otx_key",
  "SECURITYTRAILS_API_KEY": "your_st_key",
  "ZOOMEYE_API_KEY": "your_zoomeye_key",
  "SAUCENAO_API_KEY": "your_saucenao_key",
  "IMAGGA_API_KEY": "your_imagga_key",
  "IMAGGA_API_SECRET": "your_imagga_secret",
  "GOOGLE_CLOUD_API_KEY": "your_google_key",
  "GITHUB_TOKEN": "your_github_pat",
  "WHOISXML_API_KEY": "your_whoisxml_key",
  "PORT": 3000,
  "HOST": "0.0.0.0"
}
```

## Usage

### Stdio Transport (Default for many MCP clients)

```bash
node dist/index.js --stdio
```

### HTTP Transport

```bash
npm start
```
The server will be available at `http://localhost:3000/mcp`.

## Tools

| Tool Name | Description |
|-----------|-------------|
| `ip_geolocation` | Get geolocation data for an IP address |
| `whois_lookup` | Perform RDAP WHOIS lookup for a domain |
| `whois_history` | Lookup WHOIS history for a domain (Requires WHOISXML_API_KEY) |
| `dns_lookup_passive` | Get passive DNS records from Robtex |
| `dns_lookup_direct` | Real-time DNS lookup (A, MX, TXT, etc.) |
| `reverse_dns` | Lookup hostname for an IP address |
| `check_breaches` | Check if an email has been compromised (HIBP) |
| `shodan_host` | Get host details from Shodan |
| `shodan_whois` | Perform WHOIS lookup via Shodan Labs |
| `ssl_certs` | Lookup SSL certificates on crt.sh |
| `url_reputation` | Check URL reputation on VirusTotal |
| `dns_enumeration` | Perform DNS enumeration via HackerTarget |
| `subdomain_enum` | Find subdomains using multiple sources |
| `hunter_domain_search` | Search for email addresses on a domain |
| `greynoise_ip_context` | Get IP context from GreyNoise |
| `otx_indicator_details` | Get threat intel from AlienVault OTX |
| `securitytrails_subdomains` | Find subdomains via SecurityTrails |
| `zoomeye_host_search` | Search hosts on ZoomEye |
| `reverse_image_search_anime` | Search anime/art images on SauceNAO |
| `image_tagging` | Tag and categorize images with Imagga |
| `google_vision_analyze` | Analyze images with Google Vision |
| `github_user_info` | Get detailed GitHub user metadata |
| `github_user_repos` | List public GitHub repositories for a user |
| `github_commit_emails` | Extract email addresses from public GitHub commits |
| `username_search` | Search for a username across 20+ major platforms |
| `fandom_user_info` | Get Fandom/Wiki user data |
| `fandom_user_contributions` | List recent Fandom wiki contributions |
| `archive_org_snapshot` | Check for Wayback Machine snapshots of a URL |
| `mac_lookup` | Lookup vendor information for a MAC address |
| `keybase_lookup` | Lookup Keybase identity and linked accounts |
| `reddit_user_details` | Get basic Reddit user profile info |
| `reddit_user_posts` | List recent Reddit posts for a user |
| `url_metadata` | Scrape OpenGraph and meta tags from a URL |
| `url_tech_stack` | Detect technologies used on a website |
| `web_search` | Perform web search via Exa |

## License

MIT
