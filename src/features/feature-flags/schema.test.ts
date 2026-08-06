import { describe, expect, it } from "vitest";

import { createDefaultFeatureFlagValues, FEATURE_FLAGS } from "./definitions";
import { readDevelopmentFeatureFlagOverrides } from "./overrides";
import { parseFeatureFlagResponse, resolveFeatureFlagValues } from "./schema";

describe("feature flag resolution", () => {
  it("starts from the declared defaults", () => {
    expect(resolveFeatureFlagValues()).toEqual(
      createDefaultFeatureFlagValues()
    );
  });

  it("applies known remote values and ignores unknown flags", () => {
    const flags = resolveFeatureFlagValues({
      [FEATURE_FLAGS.BILLING]: false,
      unknown_flag: false,
    });

    expect(flags[FEATURE_FLAGS.BILLING]).toBe(false);
    expect(flags).not.toHaveProperty("unknown_flag");
  });

  it("gives development overrides the highest precedence", () => {
    const flags = resolveFeatureFlagValues(
      { [FEATURE_FLAGS.SHIFT_SWAPS]: false },
      { [FEATURE_FLAGS.SHIFT_SWAPS]: true }
    );

    expect(flags[FEATURE_FLAGS.SHIFT_SWAPS]).toBe(true);
  });

  it("rejects malformed API responses", () => {
    expect(() =>
      parseFeatureFlagResponse({ flags: { billing: "enabled" } })
    ).toThrow();
  });
});

describe("development overrides", () => {
  it("parses known boolean flags in development", () => {
    expect(
      readDevelopmentFeatureFlagOverrides({
        DEV: true,
        VITE_FEATURE_FLAG_OVERRIDES: JSON.stringify({
          [FEATURE_FLAGS.BILLING]: false,
          unknown_flag: true,
        }),
      })
    ).toEqual({ [FEATURE_FLAGS.BILLING]: false });
  });

  it("ignores overrides outside development", () => {
    expect(
      readDevelopmentFeatureFlagOverrides({
        DEV: false,
        VITE_FEATURE_FLAG_OVERRIDES: JSON.stringify({
          [FEATURE_FLAGS.BILLING]: false,
        }),
      })
    ).toEqual({});
  });
});
