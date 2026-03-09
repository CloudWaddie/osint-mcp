import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

const ConfigSchema = z.object({
  // IP Geolocation
  IP_API_KEY: z.string().optional(),
  
  // WHOIS
  RDAP_API_KEY: z.string().optional(),
  
  // Breach Check
  HIBP_API_KEY: z.string().optional(),
  
  // Shodan
  SHODAN_API_KEY: z.string().optional(),
  
  // Exa
  EXA_API_KEY: z.string().optional(),
  
  // VirusTotal
  VIRUSTOTAL_API_KEY: z.string().optional(),
  
  // Hunter.io
  HUNTER_API_KEY: z.string().optional(),
  
  // GreyNoise
  GREYNOISE_API_KEY: z.string().optional(),
  
  // AlienVault/LevelBlue
  ALIENVAULT_API_KEY: z.string().optional(),
  
  // SecurityTrails
  SECURITYTRAILS_API_KEY: z.string().optional(),
  
  // ZoomEye
  ZOOMEYE_API_KEY: z.string().optional(),
  
  // SauceNAO
  SAUCENAO_API_KEY: z.string().optional(),
  
  // Imagga
  IMAGGA_API_KEY: z.string().optional(),
  IMAGGA_API_SECRET: z.string().optional(),
  
  // Google Vision
  GOOGLE_CLOUD_API_KEY: z.string().optional(),

  // Server
  PORT: z.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
});

export type Config = z.infer<typeof ConfigSchema>;

class ConfigManager {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    const envConfig = {
      IP_API_KEY: process.env.IP_API_KEY,
      RDAP_API_KEY: process.env.RDAP_API_KEY,
      HIBP_API_KEY: process.env.HIBP_API_KEY,
      SHODAN_API_KEY: process.env.SHODAN_API_KEY,
      EXA_API_KEY: process.env.EXA_API_KEY,
      VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY,
      HUNTER_API_KEY: process.env.HUNTER_API_KEY,
      GREYNOISE_API_KEY: process.env.GREYNOISE_API_KEY,
      ALIENVAULT_API_KEY: process.env.ALIENVAULT_API_KEY,
      SECURITYTRAILS_API_KEY: process.env.SECURITYTRAILS_API_KEY,
      ZOOMEYE_API_KEY: process.env.ZOOMEYE_API_KEY,
      SAUCENAO_API_KEY: process.env.SAUCENAO_API_KEY,
      IMAGGA_API_KEY: process.env.IMAGGA_API_KEY,
      IMAGGA_API_SECRET: process.env.IMAGGA_API_SECRET,
      GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
      PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      HOST: process.env.HOST,
    };

    const configFilePath = path.join(process.cwd(), "config.json");
    let fileConfig = {};

    if (fs.existsSync(configFilePath)) {
      try {
        const fileContent = fs.readFileSync(configFilePath, "utf-8");
        fileConfig = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error reading config.json: ${error}`);
      }
    }

    // Merge: Env (high priority) > File > Defaults
    const merged = {
      ...fileConfig,
      ...Object.fromEntries(
        Object.entries(envConfig).filter(([_, v]) => v !== undefined)
      ),
    };

    return ConfigSchema.parse(merged);
  }

  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  getAll(): Config {
    return { ...this.config };
  }
}

export const configManager = new ConfigManager();
