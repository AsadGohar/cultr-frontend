import {
  FEATURE_FLAGS,
  type FeatureFlagKey,
  type FeatureFlagValues,
} from "@/features/feature-flags";

export const DASHBOARD_VIEW_FEATURES = {
  "requests-all": FEATURE_FLAGS.LEAVE_REQUESTS,
  leave: FEATURE_FLAGS.LEAVE_REQUESTS,
  wfh: FEATURE_FLAGS.LEAVE_REQUESTS,
  promotion: FEATURE_FLAGS.LEAVE_REQUESTS,
  loan: FEATURE_FLAGS.LEAVE_REQUESTS,
  shifts: FEATURE_FLAGS.SHIFT_SWAPS,
  "notif-rules": FEATURE_FLAGS.AUTOMATED_NOTIFICATIONS,
  "settings-billing": FEATURE_FLAGS.BILLING,
} as const satisfies Record<string, FeatureFlagKey>;

export const getDashboardViewFeature = (
  view: string
): FeatureFlagKey | undefined =>
  DASHBOARD_VIEW_FEATURES[view as keyof typeof DASHBOARD_VIEW_FEATURES];

export const isDashboardViewEnabled = (
  view: string,
  flags: FeatureFlagValues
): boolean => {
  const requiredFlag = getDashboardViewFeature(view);
  return requiredFlag ? flags[requiredFlag] : true;
};
