import { getAccessToken } from "@/utils/cookieUtils";

import { parseFeatureFlagResponse, type FeatureFlagResponse } from "./schema";

export interface FeatureFlagEvaluationContext {
  userId?: string;
  organizationId?: string;
  role?: string;
}

export interface FeatureFlagClient {
  getFlags(context: FeatureFlagEvaluationContext): Promise<FeatureFlagResponse>;
}

export class LocalFeatureFlagClient implements FeatureFlagClient {
  async getFlags(): Promise<FeatureFlagResponse> {
    return { flags: {}, version: "local-defaults" };
  }
}

export class HttpFeatureFlagClient implements FeatureFlagClient {
  constructor(private readonly endpoint: string) {}

  async getFlags(
    context: FeatureFlagEvaluationContext
  ): Promise<FeatureFlagResponse> {
    const query = new URLSearchParams(
      Object.entries(context).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    );
    const separator = this.endpoint.includes("?") ? "&" : "?";
    const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL ?? "";
    const endpoint = /^https?:\/\//.test(this.endpoint)
      ? this.endpoint
      : `${baseUrl}${this.endpoint}`;
    const token = getAccessToken();
    const response = await fetch(
      query.size > 0 ? `${endpoint}${separator}${query}` : endpoint,
      {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    if (!response.ok) {
      throw new Error(`Feature flag request failed with ${response.status}.`);
    }

    return parseFeatureFlagResponse(await response.json());
  }
}

export const createFeatureFlagClient = (): FeatureFlagClient => {
  const endpoint = import.meta.env.VITE_FEATURE_FLAGS_ENDPOINT?.trim();

  return endpoint
    ? new HttpFeatureFlagClient(endpoint)
    : new LocalFeatureFlagClient();
};
