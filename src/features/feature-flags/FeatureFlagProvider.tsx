import * as Sentry from "@sentry/react";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createFeatureFlagClient,
  type FeatureFlagClient,
  type FeatureFlagEvaluationContext,
} from "./client";
import type { FeatureFlagKey, FeatureFlagValues } from "./definitions";
import { readDevelopmentFeatureFlagOverrides } from "./overrides";
import { resolveFeatureFlagValues } from "./schema";

const FEATURE_FLAGS_QUERY_KEY = "feature-flags";

interface FeatureFlagContextValue {
  flags: FeatureFlagValues;
  isReady: boolean;
  isRefreshing: boolean;
  version?: string;
}

interface FeatureFlagProviderProps {
  children: ReactNode;
  client?: FeatureFlagClient;
  context?: FeatureFlagEvaluationContext;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(
  undefined
);

const getDevelopmentOverrides = () => {
  try {
    return readDevelopmentFeatureFlagOverrides();
  } catch (error) {
    Sentry.captureException(error, {
      tags: { layer: "feature-flags", source: "development-overrides" },
    });
    console.warn("Feature flag overrides are invalid and were ignored.", error);
    return {};
  }
};

export function FeatureFlagProvider({
  children,
  client: providedClient,
  context = {},
}: FeatureFlagProviderProps) {
  const [client] = useState(() => providedClient ?? createFeatureFlagClient());
  const [developmentOverrides] = useState(getDevelopmentOverrides);
  const query = useQuery({
    queryKey: [
      FEATURE_FLAGS_QUERY_KEY,
      context.userId ?? "anonymous",
      context.organizationId ?? "none",
      context.role ?? "none",
    ],
    queryFn: () => client.getFlags(context),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.error) {
      return;
    }

    Sentry.captureException(query.error, {
      tags: { layer: "feature-flags", source: "client" },
      extra: { evaluationContext: context },
    });
  }, [context, query.error]);

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      flags: resolveFeatureFlagValues(query.data?.flags, developmentOverrides),
      isReady: query.isSuccess || query.isError,
      isRefreshing: query.isFetching,
      version: query.data?.version,
    }),
    [
      developmentOverrides,
      query.data,
      query.isError,
      query.isFetching,
      query.isSuccess,
    ]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

const useFeatureFlagContext = (): FeatureFlagContextValue => {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error(
      "Feature flag hooks must be used within FeatureFlagProvider."
    );
  }

  return context;
};

export const useFeatureFlag = (flag: FeatureFlagKey): boolean =>
  useFeatureFlagContext().flags[flag];

export const useFeatureFlags = (): FeatureFlagValues =>
  useFeatureFlagContext().flags;

export const useFeatureFlagStatus = () => {
  const { isReady, isRefreshing, version } = useFeatureFlagContext();

  return { isReady, isRefreshing, version };
};
