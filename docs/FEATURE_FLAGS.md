# Feature Flags

The frontend uses a typed, provider-independent feature flag layer. React Query
owns remote flag data and `FeatureFlagProvider` exposes evaluated values to the
component tree. Feature flags control availability; they do not replace backend
authorization or permission checks.

## Runtime behavior

Flag values are resolved in this order, from lowest to highest precedence:

1. Defaults declared in `src/features/feature-flags/definitions.ts`.
2. Values returned by the configured feature flag client.
3. Development-only values from `VITE_FEATURE_FLAG_OVERRIDES`.

The local client is used when `VITE_FEATURE_FLAGS_ENDPOINT` is absent. It makes
no network request and preserves current behavior through declared defaults.

When an endpoint is configured, the frontend sends the available `userId`,
`organizationId`, and `role` as query parameters. The endpoint must return
already-evaluated boolean values:

```json
{
  "flags": {
    "leave_requests": true,
    "shift_swaps": false
  },
  "version": "optional-version"
}
```

Responses are validated with Zod. Unknown flags are ignored, malformed
responses are reported to Sentry, and declared defaults remain active.

## Registering a flag

1. Add its public key to `FEATURE_FLAGS`.
2. Add its default, description, and owner to `FEATURE_FLAG_DEFINITIONS`.
3. Use `useFeatureFlag` for behavior or `FeatureGate` for rendering.
4. Add the flag to centralized route or view access metadata when it protects a
   complete screen.
5. Test both enabled and disabled paths.

New or incomplete features should default to `false`. Existing features in the
initial registry default to `true` to preserve current application behavior.

```tsx
const enabled = useFeatureFlag(FEATURE_FLAGS.BILLING);

<FeatureGate flag={FEATURE_FLAGS.BILLING} fallback={<NotAvailable />}>
  <Billing />
</FeatureGate>;
```

## Local development overrides

Overrides are accepted only when Vite is running in development mode:

```env
VITE_FEATURE_FLAG_OVERRIDES={"billing":false,"shift_swaps":true}
```

Invalid JSON or non-boolean values are ignored and reported. Production builds
never apply this environment override.

## Connecting a backend

Set `VITE_FEATURE_FLAGS_ENDPOINT` to a relative API path, for example:

```env
VITE_FEATURE_FLAGS_ENDPOINT=/feature-flags
```

If the eventual backend uses a different response envelope, implement another
`FeatureFlagClient` adapter and provide it to `FeatureFlagProvider`; feature
consumers do not need to change.

## Lifecycle

Every flag must have an owner. After rollout is complete, remove the old code
path, its tests, its access metadata, and the registry entry. Long-lived flags
should be reserved for operational controls rather than completed migrations.

