import { BaseApiClient } from "../lib/api-client.js";
import { IpGeolocation, IpGeolocationSchema } from "../types/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class IpApiClient extends BaseApiClient {
  protected baseUrl = "http://ip-api.com/json/";

  constructor() {
    // ip-api.com free tier: 45 requests per minute
    super(45);
  }

  async getLocation(ip: string): Promise<IpGeolocation> {
    try {
      const data = await this.fetch<any>(ip, {
        method: "GET",
      }, {
        fields: "status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query"
      });

      if (data.status === "fail") {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `IP Geolocation failed: ${data.message}`
        );
      }

      return IpGeolocationSchema.parse({
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as,
        mobile: data.mobile,
        proxy: data.proxy,
        hosting: data.hosting,
      });
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `IP Geolocation error: ${(error as Error).message}`
      );
    }
  }
}
