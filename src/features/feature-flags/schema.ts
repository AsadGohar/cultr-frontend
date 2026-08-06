import { z } from "zod";

import {
  createDefaultFeatureFlagValues,
  isFeatureFlagKey,
  type FeatureFlagOverrides,
  type FeatureFlagValues,
} from "./definitions";

export const featureFlagResponseSchema = z.object({
  flags: z.record(z.string(), z.boolean()),
  version: z.string().optional(),
});

export type FeatureFlagResponse = z.infer<typeof featureFlagResponseSchema>;

export const parseFeatureFlagResponse = (
  response: unknown
): FeatureFlagResponse => featureFlagResponseSchema.parse(response);

export const toKnownFeatureFlagOverrides = (
  values: Record<string, boolean>
): FeatureFlagOverrides => {
  const knownValues: FeatureFlagOverrides = {};

  for (const [key, value] of Object.entries(values)) {
    if (isFeatureFlagKey(key)) {
      knownValues[key] = value;
    }
  }

  return knownValues;
};

export const resolveFeatureFlagValues = (
  remoteValues: Record<string, boolean> = {},
  overrides: FeatureFlagOverrides = {}
): FeatureFlagValues => ({
  ...createDefaultFeatureFlagValues(),
  ...toKnownFeatureFlagOverrides(remoteValues),
  ...overrides,
});
