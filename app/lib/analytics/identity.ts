import "server-only";

import { createHmac, randomBytes } from "node:crypto";

export const ANALYTICS_VISITOR_COOKIE = "dsh_visitor";
export const ANALYTICS_VISITOR_MAX_AGE = 60 * 60 * 24 * 365;

function hashSecret() {
  const secret = process.env.ANALYTICS_HASH_SECRET?.trim();
  if (!secret) throw new Error("Analytics hash secret is not configured.");
  return secret;
}

export function newVisitorId() {
  return randomBytes(32).toString("base64url");
}

export function visitorHash(visitorId: string) {
  return createHmac("sha256", hashSecret()).update(visitorId).digest("hex");
}
