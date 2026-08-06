import type { ReactNode } from "react";

import type { FeatureFlagKey } from "./definitions";
import { useFeatureFlag, useFeatureFlagStatus } from "./FeatureFlagProvider";

interface FeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  flag: FeatureFlagKey;
  loadingFallback?: ReactNode;
}

export function FeatureGate({
  children,
  fallback = null,
  flag,
  loadingFallback = null,
}: FeatureGateProps) {
  const enabled = useFeatureFlag(flag);
  const { isReady } = useFeatureFlagStatus();

  if (!isReady) {
    return loadingFallback;
  }

  return enabled ? children : fallback;
}
