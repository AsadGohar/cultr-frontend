export const FEATURE_FLAGS = {
  LEAVE_REQUESTS: "leave_requests",
  SHIFT_SWAPS: "shift_swaps",
  AUTOMATED_NOTIFICATIONS: "automated_notifications",
  BILLING: "billing",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

export interface FeatureFlagDefinition {
  defaultValue: boolean;
  description: string;
  owner: string;
}

export const FEATURE_FLAG_DEFINITIONS = {
  [FEATURE_FLAGS.LEAVE_REQUESTS]: {
    defaultValue: true,
    description: "Leave, work-from-home, promotion, and loan requests",
    owner: "People Operations",
  },
  [FEATURE_FLAGS.SHIFT_SWAPS]: {
    defaultValue: true,
    description: "Shift swap requests and review workflows",
    owner: "People Operations",
  },
  [FEATURE_FLAGS.AUTOMATED_NOTIFICATIONS]: {
    defaultValue: true,
    description: "Automated notification rule configuration",
    owner: "Platform",
  },
  [FEATURE_FLAGS.BILLING]: {
    defaultValue: true,
    description: "Billing settings and plan management",
    owner: "Commercial",
  },
} satisfies Record<FeatureFlagKey, FeatureFlagDefinition>;

export type FeatureFlagValues = Record<FeatureFlagKey, boolean>;
export type FeatureFlagOverrides = Partial<FeatureFlagValues>;

const featureFlagKeys = new Set<string>(Object.values(FEATURE_FLAGS));

export const isFeatureFlagKey = (value: string): value is FeatureFlagKey =>
  featureFlagKeys.has(value);

export const createDefaultFeatureFlagValues = (): FeatureFlagValues =>
  Object.fromEntries(
    Object.entries(FEATURE_FLAG_DEFINITIONS).map(([key, definition]) => [
      key,
      definition.defaultValue,
    ])
  ) as FeatureFlagValues;
