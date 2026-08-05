export const SEGMENTS = {
  PUBLIC: "public",
};

export const ROUTES = {
  HOME: "/",
  NOT_FOUND: "*",
  AUTH: {
    LOGIN: "/login",
  }
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
