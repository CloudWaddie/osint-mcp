import { z } from "zod";

// --- IP Geolocation ---
export const IpGeolocationSchema = z.object({
  ip: z.string(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
  regionName: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
  org: z.string().optional(),
  as: z.string().optional(),
  mobile: z.boolean().optional(),
  proxy: z.boolean().optional(),
  hosting: z.boolean().optional(),
});

export type IpGeolocation = z.infer<typeof IpGeolocationSchema>;

// --- WHOIS / RDAP ---
export const WhoisResultSchema = z.object({
  domain: z.string(),
  registrar: z.string().optional(),
  registrationDate: z.string().optional(),
  expirationDate: z.string().optional(),
  nameServers: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  raw: z.any().optional(),
});

export type WhoisResult = z.infer<typeof WhoisResultSchema>;

// --- DNS ---
export const DnsRecordSchema = z.object({
  type: z.string(),
  value: z.string(),
  ttl: z.number().optional(),
  priority: z.number().optional(),
});

export const DnsResultSchema = z.object({
  domain: z.string(),
  records: z.array(DnsRecordSchema),
});

export type DnsResult = z.infer<typeof DnsResultSchema>;

// --- Breach ---
export const BreachResultSchema = z.object({
  name: z.string(),
  title: z.string(),
  domain: z.string(),
  breachDate: z.string(),
  addedDate: z.string(),
  modifiedDate: z.string(),
  pwnCount: z.number(),
  description: z.string(),
  dataClasses: z.array(z.string()),
  isVerified: z.boolean(),
  isFabricated: z.boolean(),
  isSensitive: z.boolean(),
  isRetired: z.boolean(),
  isSpamList: z.boolean(),
  logoPath: z.string().optional(),
});

export type BreachResult = z.infer<typeof BreachResultSchema>;

// --- Shodan ---
export const ShodanHostSchema = z.object({
  ip_str: z.string(),
  port: z.number(),
  transport: z.string(),
  hostnames: z.array(z.string()),
  location: z.any(),
  org: z.string().optional(),
  isp: z.string().optional(),
  asn: z.string().optional(),
  os: z.string().optional(),
  domains: z.array(z.string()),
  data: z.array(z.any()),
});

export type ShodanHost = z.infer<typeof ShodanHostSchema>;

// --- Search ---
export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  text: z.string().optional(),
  score: z.number().optional(),
  publishedDate: z.string().optional(),
  author: z.string().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
