export const ROUTES = {
  HOME: "/",
  NOT_FOUND: "*",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
