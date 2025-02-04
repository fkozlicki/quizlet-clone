import { env } from "~/env";

export function getAppUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return `https://${env.VERCEL_URL}`;
}
