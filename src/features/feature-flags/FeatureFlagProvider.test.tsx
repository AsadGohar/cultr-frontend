import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { FeatureFlagClient, FeatureFlagEvaluationContext } from "./client";
import { FEATURE_FLAGS } from "./definitions";
import { FeatureGate } from "./FeatureGate";
import { FeatureFlagProvider, useFeatureFlag } from "./FeatureFlagProvider";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { gcTime: 0, retry: false },
    },
  });

function TestProviders({
  children,
  client,
  context,
}: {
  children: ReactNode;
  client: FeatureFlagClient;
  context?: FeatureFlagEvaluationContext;
}) {
  return (
    <QueryClientProvider client={createQueryClient()}>
      <FeatureFlagProvider client={client} context={context}>
        {children}
      </FeatureFlagProvider>
    </QueryClientProvider>
  );
}

function BillingValue() {
  const enabled = useFeatureFlag(FEATURE_FLAGS.BILLING);
  return <span>{enabled ? "enabled" : "disabled"}</span>;
}

describe("FeatureFlagProvider", () => {
  it("shows a loading fallback until evaluation finishes", () => {
    const client: FeatureFlagClient = {
      getFlags: () => new Promise(() => undefined),
    };

    render(
      <TestProviders client={client}>
        <FeatureGate
          flag={FEATURE_FLAGS.BILLING}
          loadingFallback={<span>loading</span>}
        >
          <span>billing</span>
        </FeatureGate>
      </TestProviders>
    );

    expect(screen.getByText("loading")).toBeTruthy();
    expect(screen.queryByText("billing")).toBeNull();
  });

  it("uses the declared fallback when a remote flag is disabled", async () => {
    const client: FeatureFlagClient = {
      getFlags: async () => ({
        flags: { [FEATURE_FLAGS.BILLING]: false },
      }),
    };

    render(
      <TestProviders client={client}>
        <FeatureGate
          flag={FEATURE_FLAGS.BILLING}
          fallback={<span>unavailable</span>}
        >
          <span>billing</span>
        </FeatureGate>
      </TestProviders>
    );

    expect(await screen.findByText("unavailable")).toBeTruthy();
  });

  it("re-evaluates flags when the user context changes", async () => {
    const getFlags = vi.fn(async (context: FeatureFlagEvaluationContext) => ({
      flags: { [FEATURE_FLAGS.BILLING]: Boolean(context.userId) },
    }));
    const client: FeatureFlagClient = { getFlags };
    const queryClient = createQueryClient();
    const renderTree = (context: FeatureFlagEvaluationContext) => (
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider client={client} context={context}>
          <BillingValue />
        </FeatureFlagProvider>
      </QueryClientProvider>
    );

    const result = render(renderTree({ userId: "user-1" }));
    await waitFor(() => expect(screen.getByText("enabled")).toBeTruthy());

    result.rerender(renderTree({}));
    await waitFor(() => expect(screen.getByText("disabled")).toBeTruthy());
    expect(getFlags).toHaveBeenCalledTimes(2);
  });
});
