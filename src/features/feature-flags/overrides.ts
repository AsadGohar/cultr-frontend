import { z } from "zod";

import type { FeatureFlagOverrides } from "./definitions";
import { toKnownFeatureFlagOverrides } from "./schema";

interface FeatureFlagEnvironment {
  DEV: boolean;
  VITE_FEATURE_FLAG_OVERRIDES?: string;
}

const overrideSchema = z.record(z.string(), z.boolean());

export const readDevelopmentFeatureFlagOverrides = (
  environment: FeatureFlagEnvironment = import.meta.env
): FeatureFlagOverrides => {
  if (!environment.DEV || !environment.VITE_FEATURE_FLAG_OVERRIDES) {
    return {};
  }

  const parsedJson: unknown = JSON.parse(
    environment.VITE_FEATURE_FLAG_OVERRIDES
  );
  const overrides = overrideSchema.parse(parsedJson);

  return toKnownFeatureFlagOverrides(overrides);
};
