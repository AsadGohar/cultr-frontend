import { describe, expect, it } from "vitest";

import {
  createDefaultFeatureFlagValues,
  FEATURE_FLAGS,
} from "@/features/feature-flags";

import { isDashboardViewEnabled } from "./featureAccess";

describe("dashboard feature access", () => {
  it("allows views without a feature requirement", () => {
    expect(
      isDashboardViewEnabled("overview", createDefaultFeatureFlagValues())
    ).toBe(true);
  });

  it("blocks every view protected by a disabled flag", () => {
    const flags = {
      ...createDefaultFeatureFlagValues(),
      [FEATURE_FLAGS.LEAVE_REQUESTS]: false,
    };

    expect(isDashboardViewEnabled("leave", flags)).toBe(false);
    expect(isDashboardViewEnabled("wfh", flags)).toBe(false);
    expect(isDashboardViewEnabled("requests-all", flags)).toBe(false);
  });

  it("keeps independently flagged views available", () => {
    const flags = {
      ...createDefaultFeatureFlagValues(),
      [FEATURE_FLAGS.LEAVE_REQUESTS]: false,
      [FEATURE_FLAGS.SHIFT_SWAPS]: true,
    };

    expect(isDashboardViewEnabled("shifts", flags)).toBe(true);
  });
});
