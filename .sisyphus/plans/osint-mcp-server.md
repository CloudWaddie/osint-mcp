# OSINT MCP Server - Work Plan

## TL;DR

> **Quick Summary**: Build an OSINT MCP server in TypeScript with OSINT tools for IP lookup, DNS, WHOIS, email finding, breach checking, web search, and image reverse search. Prioritize free sources first, add API-key sources as optional tools.

> **Deliverables**:
> - MCP server with 18+ OSINT tools
> - Support for both stdio and HTTP transport
> - Graceful handling of missing API keys
> - Rate limiting per service
> - Configuration via env vars and .gitignored config file

> **Estimated Effort**: Large (18+ sources)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Project Setup → Core Abstractions → MVP Tools → Full Sources

---

## Context

### Original Request
User wants to build an OSINT MCP server with:
- TypeScript + @modelcontextprotocol/server
- Both free (no-auth) and API-key sources
- All sources prioritized (free first)
- Exa for web search
- API keys via env vars + config file

### Interview Summary
**Key Discussions**:
- Tech Stack: TypeScript with MCP SDK
- Priority: Everything (all sources), but prioritize free
- API Keys: Both env vars and config file
- Web Search: Exa API

**Research Findings**:
- 40+ OSINT sources identified across categories
- Free tier limitations documented
- MCP SDK patterns established (Streamable HTTP, Zod v4)
- Security/legal considerations for breach databases

---

## Work Objectives

### Core Objective
Build a comprehensive OSINT MCP server with tools for:
1. **IP Intelligence**: Geolocation, WHOIS, reputation
2. **Domain Intelligence**: DNS enumeration, SSL certificates, WHOIS
3. **Breach Checking**: Email/username breach search
4. **Email OSINT**: Email finding and verification
5. **Web Search**: General web search
6. **Image Search**: Reverse image lookup

### Concrete Deliverables
- `src/index.ts` - Main MCP server entry point
- `src/tools/` - Individual tool implementations
- `src/lib/` - Shared utilities (API clients, rate limiter, config)
- `src/types/` - TypeScript types and Zod schemas
- `config.example.json` - Example configuration template
- `.gitignore` - Proper ignores for config files
- `package.json` - Dependencies and scripts

### Definition of Done
- [ ] `npm run build` compiles without errors
- [ ] Server starts with `npm start`
- [ ] MCP tools are discoverable via `/tools/list`
- [ ] Each tool returns valid JSON responses
- [ ] Graceful handling when API keys missing
- [ ] All tools have input validation via Zod

### Must Have
- ✅ TypeScript compilation
- ✅ MCP server with tools/list and tools/call
- ✅ Rate limiting per service
- ✅ Graceful degradation (tools work without API keys)
- ✅ Input validation with Zod
- ✅ .gitignore for config files
- ✅ Error handling (no raw API error leaks)

### Must NOT Have (Guardrails)
- ❌ All 18+ sources in single wave (use phased approach)
- ❌ console.log() with stdio transport (use console.error())
- ❌ Store raw API responses
- ❌ Cache sensitive data
- ❌ Use console.log for JSON-RPC responses

---

## Verification Strategy

### Test Decision
- **Infrastructure**: Node.js test framework (node:test or vitest)
- **Automated tests**: Tests-after (not TDD)
- **Framework**: node:test (built-in)

### QA Policy
Every task includes agent-executed QA scenarios:
- Build verification: `npm run build`
- Server startup: `npm start` + health check
- Tool discovery: curl to /tools/list
- Functional test: Call each tool with sample data
- Graceful failure: Test without API keys

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - 5 tasks):
├── Task 1: Project scaffolding + TypeScript config
├── Task 2: MCP server setup (express + stdio)
├── Task 3: Configuration system (env + config file)
├── Task 4: Shared types + Zod schemas
└── Task 5: Core abstractions (API client base, rate limiter)

Wave 2 (MVP Tools - 6 tasks):
├── Task 6: IP Geolocation (ip-api.com) [FREE]
├── Task 7: WHOIS Lookup (RDAP) [FREE]
├── Task 8: DNS Lookup (Robtex) [FREE]
├── Task 9: HaveIBeenPwned integration [FREE-KEY]
├── Task 10: Shodan integration [API-KEY]
└── Task 11: Exa Web Search [API-KEY]

Wave 3 (Free Sources - 5 tasks):
├── Task 12: SSL Certificate lookup (crt.sh) [FREE]
├── Task 13: URL Reputation (VirusTotal) [API-KEY]
├── Task 14: DNS Enumeration (DNSDumpster) [FREE]
├── Task 15: IP WHOIS (Shodan) [API-KEY]
└── Task 16: Subdomain Enumeration [FREE]

Wave 4 (API-Key Sources - 5 tasks):
├── Task 17: Hunter.io Email Finder [API-KEY]
├── Task 18: GreyNoise Threat Intel [API-KEY]
├── Task 19: AlienVault/LevelBlue OTX [API-KEY]
├── Task 20: SecurityTrails DNS History [API-KEY]
└── Task 21: ZoomEye Device Search [API-KEY]

Wave 5 (Image Sources - 3 tasks):
├── Task 22: SauceNAO Reverse Image [FREE-KEY]
├── Task 23: Imagga Visual Search [API-KEY]
└── Task 24: Google Vision API [API-KEY]

Wave 6 (Polish - 3 tasks):
├── Task 25: Error handling + logging polish
├── Task 26: Documentation + tool descriptions
└── Task 27: Final verification + cleanup
```

### Agent Dispatch Summary
- **Wave 1**: 5 tasks → `unspecified-high` (foundation)
- **Wave 2**: 6 tasks → `deep` (MVP - critical)
- **Wave 3**: 5 tasks → `unspecified-high`
- **Wave 4**: 5 tasks → `unspecified-high`
- **Wave 5**: 3 tasks → `unspecified-low`
- **Wave 6**: 3 tasks → `quick`

---

## TODOs

- [x] 1. Project scaffolding + TypeScript config

  **What to do**:
  - Initialize TypeScript project with package.json
  - Install dependencies: @modelcontextprotocol/server, @modelcontextprotocol/sdk, @modelcontextprotocol/express, zod
  - Configure tsconfig.json for MCP server
  - Create .gitignore with config file patterns
  - Set up npm scripts (build, start, dev)

  **Must NOT do**:
  - Don't use console.log() for stdio transport

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Foundation setup requires proper configuration
  - **Skills**: []
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (with Tasks 2-5)
  - **Blocks**: All subsequent tasks
  - **Blocked By**: None

  **References**:
  - Official MCP SDK: `https://github.com/modelcontextprotocol/typescript-sdk`
  - Zod: `https://zod.dev/`

  **Acceptance Criteria**:
  - [x] npm install completes
  - [x] npm run build compiles without errors
  - [x] .gitignore includes config patterns

  **QA Scenarios**:
  - Scenario: Project builds successfully
    Tool: Bash
    Steps: npm install && npm run build
    Expected Result: Exit code 0, no TypeScript errors
    Evidence: Build output in terminal

- [x] 2. MCP server setup (express + stdio)

  **What to do**:
  - Create main server with createMcpExpressApp()
  - Implement stdio transport as fallback
  - Add /mcp endpoint for HTTP transport
  - Set up proper logging with console.error()

  **Must NOT do**:
  - Don't use console.log() with stdio transport
  - Don't expose raw error stack traces

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: MCP server architecture requires understanding of protocol
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-5)
  - **Blocks**: All tool implementations
  - **Blocked By**: Task 1

  **References**:
  - MCP Express: `@modelcontextprotocol/express`
  - Example server: `https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples`

  **Acceptance Criteria**:
  - [x] Server starts with npm start
  - [x] /mcp endpoint responds to /tools/list
  - [x] Tools are discoverable

  **QA Scenarios**:
  - Scenario: Server starts and responds to tools/list
    Tool: Bash
    Preconditions: Server running on port 3000
    Steps: curl -s http://localhost:3000/mcp -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
    Expected Result: Valid JSON with tools array
    Evidence: JSON response in terminal

- [x] 3. Configuration system (env + config file)

  **What to do**:
  - Create config module that reads from:
    1. Environment variables (highest priority)
    2. Config file (config.json)
    3. Defaults
  - Create config.example.json template
  - Handle missing API keys gracefully
  - Validate required vs optional keys per tool

  **Must NOT do**:
  - Don't commit config.json
  - Don't store API keys in source

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 9-27 (all API-key tools)
  - **Blocked By**: Task 1

  **References**:
  - Standard Node.js config patterns

  **Acceptance Criteria**:
  - [x] Env vars override config file
  - [x] Config file is .gitignored
  - [x] Example config exists

  **QA Scenarios**:
  - Scenario: Config loads from env vars
    Tool: Bash
    Steps: SHODAN_API_KEY=test npm start (check logs)
    Expected Result: Config loads API key from env
    Evidence: Log output

- [x] 4. Shared types + Zod schemas

  **What to do**:
  - Define types for all tool inputs/outputs
  - Create Zod schemas for validation
  - Type the API client responses
  - Common types: IpGeolocation, WhoisResult, DnsRecord, BreachResult, etc.

  **Must NOT do**:
  - Don't use any for types

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: All tool implementations
  - **Blocked By**: Task 1

  **References**:
  - Zod documentation: `https://zod.dev/`

  **Acceptance Criteria**:
  - [x] Schemas validate correct inputs
  - [x] Schemas reject invalid inputs with clear errors
- [x] 5. Core abstractions (API client base, rate limiter)

  **What to do**:
  - Create BaseApiClient class with:
    - fetch wrapper with timeout
    - Rate limiting (per-service)
    - Error handling
    - Response parsing
  - Implement per-service adapters
  - Handle 429 responses with Retry-After

  **Must NOT do**:
  - Don't expose raw API errors to clients

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: MCP server architecture requires understanding of protocol
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 6-27
  - **Blocked By**: Task 4

  **Acceptance Criteria**:
  - [x] BaseApiClient supports fetch with rate limiting
  - [x] RateLimiter correctly delays requests

- [x] 6. IP Geolocation (ip-api.com) [FREE]

  **What to do**:
  - Implement ip-api.com integration
  - No API key required
  - Rate limit: 45 requests/minute
  - Return: country, city, ISP, org, lat/lon

  **Must NOT do**:
  - Don't exceed rate limits
  - Don't use for commercial purposes (ip-api.com ToS)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-11)
  - **Blocks**: None
  - **Blocked By**: Task 5

  **References**:
  - ip-api.com docs: `http://ip-api.com/docs/`

  **Acceptance Criteria**:
  - [x] Tool name: ip_geolocation
  - [x] Input: ip address (string)
  - [x] Returns: country, city, region, ISP, org, lat, lon

  **QA Scenarios**:
  - Scenario: Lookup IP address
    Tool: Bash
    Steps: Call tool with ip="8.8.8.8"
    Expected Result: JSON with country="United States", city="Mountain View"
    Evidence: Tool output

- [x] 7. WHOIS Lookup (RDAP) [FREE]

  **What to do**:
  - Implement RDAP WHOIS lookup
  - Use rdap.org or who-dat
  - Return: registrar, created date, expiry, nameservers

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2

- [x] 8. DNS Lookup (Robtex) [FREE]

  **What to do**:
  - Implement DNS lookup via Robtex
  - Return: A, AAAA, CNAME, MX, NS, TXT records

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2

- [x] 9. HaveIBeenPwned integration [FREE-KEY]

  **What to do**:
  - Implement breach checking via HIBP API v3
  - Requires free API key (hibp-api-key)
  - Graceful handling when no key provided
  - Return: breach name, date, data classes

  **Must NOT do**:
  - Don't expose raw API key in logs

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Task 3 (config)

- [x] 10. Shodan integration [API-KEY]

  **What to do**:
  - Implement Shodan API client
  - Requires SHODAN_API_KEY
  - Features: host search, banners, ports, CVEs

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2

- [x] 11. Exa Web Search [API-KEY]

  **What to do**:
  - Implement Exa API client
  - Requires EXA_API_KEY
  - Features: web search, content extraction

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2

- [x] 12. SSL Certificate lookup (crt.sh) [FREE]

  **What to do**:
  - Implement crt.sh Certificate Transparency lookup
  - Return: certificates, common names, issuers

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Parallelize**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13-16)

- [x] 13. URL Reputation (VirusTotal) [API-KEY]

  **What to do**:
  - Implement VirusTotal v3 API
  - Requires VIRUSTOTAL_API_KEY
  - Features: URL analysis, detection ratios

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Parallelize**: YES
  - **Parallel Group**: Wave 3

- [x] 14. DNS Enumeration (DNSDumpster) [FREE]

  **What to do**:
  - Implement DNS enumeration via HackerTarget (as replacement for DNSDumpster)
  - Return: subdomains, DNS records, MX records

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Parallelize**: YES
  - **Parallel Group**: Wave 3

- [x] 15. IP WHOIS (Shodan) [API-KEY]

  **What to do**:
  - Add Shodan WHOIS via /labs/whois endpoint

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Parallelize**: YES
  - **Parallel Group**: Wave 3

- [x] 16. Subdomain Enumeration [FREE]

  **What to do**:
  - Combine crt.sh + HackerTarget for subdomain enumeration
  - Return: list of discovered subdomains

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Parallelize**: YES
  - **Parallel Group**: Wave 3


- [x] 17. Hunter.io Email Finder [API-KEY]

  **What to do**:
  - Implement Hunter.io API
  - Requires HUNTER_API_KEY
  - Features: domain search, email finder, verifier

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 18-21)

- [x] 18. GreyNoise Threat Intel [API-KEY]

  **What to do**:
  - Implement GreyNoise API
  - Requires GREYNOISE_API_KEY
  - Features: IP context, classification, tags

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4

- [x] 19. AlienVault/LevelBlue OTX [API-KEY]

  **What to do**:
  - Implement AlienVault OTX (now LevelBlue) API
  - Requires ALIENVAULT_API_KEY
  - Features: pulses, indicators, threat data

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4

- [x] 20. SecurityTrails DNS History [API-KEY]

  **What to do**:
  - Implement SecurityTrails API
  - Requires SECURITYTRAILS_API_KEY
  - Features: DNS history, WHOIS history, subdomains

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4

- [x] 21. ZoomEye Device Search [API-KEY]

  **What to do**:
  - Implement ZoomEye API
  - Requires ZOOMEYE_API_KEY
  - Features: host search, web search, dork support

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4

- [x] 22. SauceNAO Reverse Image [FREE-KEY]

  **What to do**:
  - Implement SauceNAO API
  - Requires SAUCENAO_API_KEY (free registration)
  - Features: reverse image search for anime/art

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 23-24)

- [x] 23. Imagga Visual Search [API-KEY]

  **What to do**:
  - Implement Imagga API
  - Requires IMAGGA_API_KEY
  - Features: tagging, similarity search, colors

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5

- [x] 24. Google Vision API [API-KEY]

  **What to do**:
  - Implement Google Cloud Vision API
  - Requires GOOGLE_CLOUD_API_KEY
  - Features: label detection, OCR, face detection

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5

- [x] 25. Error handling + logging polish

  **What to do**:
  - Ensure all tools have consistent error handling
  - Add proper logging throughout
  - Handle edge cases (timeouts, invalid inputs)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6
  - **Blocked By**: Wave 5

- [x] 26. Documentation + tool descriptions

  **What to do**:
  - Add clear descriptions for all MCP tools
  - Document required vs optional API keys
  - Create README with setup instructions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6

- [x] 27. Final verification + cleanup

  **What to do**:
  - Run full test suite
  - Verify all tools are discoverable
  - Clean up temporary files

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Verify all MVP tools implemented and working

- [x] F2. **Build Verification** — `unspecified-high`
  Run npm run build + verify no errors

- [x] F3. **Tool Discovery Test** — `unspecified-high`
  Verify all 18+ tools are listed via /tools/list

- [x] F4. **Graceful Failure Test** — `deep`
  Test each tool without API keys - verify helpful error messages


---

## Commit Strategy

- **1**: `feat: project setup and MCP foundation` — package.json, tsconfig.json, src/index.ts
- **2**: `feat: add configuration system` — src/lib/config.ts, config.example.json
- **3**: `feat: add core abstractions` — src/lib/api-client.ts, src/lib/rate-limiter.ts
- **4**: `feat: add MVP tools (ip-geo, whois, dns, hibp, shodan, exa)` — src/tools/*.ts
- **5**: `feat: add free sources (ssl, virustotal, dnsdumpster)` — src/tools/*.ts
- **6**: `feat: add API-key sources (hunter, greynoise, etc.)` — src/tools/*.ts
- **7**: `feat: add image search tools` — src/tools/*.ts
- **8**: `docs: add README and tool documentation` — README.md

---

## Success Criteria

### Verification Commands
```bash
npm run build     # TypeScript compiles
npm start        # Server starts
curl localhost:3000/mcp -X POST -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Final Checklist
- [ ] All MVP tools working (6 tools)
- [ ] All extended tools working (18+ tools)
- [ ] Graceful handling without API keys
- [ ] Rate limiting active
- [ ] Input validation via Zod
- [ ] .gitignore properly configured
- [ ] Documentation complete
