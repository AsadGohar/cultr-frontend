import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  FeatureFlagProvider,
  type FeatureFlagEvaluationContext,
} from "@/features/feature-flags";

interface AppProvidersProps {
  children: ReactNode;
  featureFlagContext?: FeatureFlagEvaluationContext;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

export function AppProviders({
  children,
  featureFlagContext,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureFlagProvider context={featureFlagContext}>
        {children}
      </FeatureFlagProvider>
    </QueryClientProvider>
  );
}
