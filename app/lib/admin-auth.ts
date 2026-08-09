import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "dsh_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

type SessionPayload = { role: "analytics_admin"; exp: number };

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function configuredPassword() {
  return process.env.ADMIN_ANALYTICS_PASSWORD || "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function isAdminAuthConfigured() {
  return Boolean(configuredPassword() && sessionSecret().length >= 32);
}

export function verifyAdminPassword(password: string) {
  return isAdminAuthConfigured() && safeEqual(password, configuredPassword());
}

export function createAdminSession() {
  const payload: SessionPayload = { role: "analytics_admin", exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { token: `${encodedPayload}.${sign(encodedPayload)}`, maxAge: SESSION_MAX_AGE };
}

export function verifyAdminSession(token: string | undefined) {
  if (!token || !isAdminAuthConfigured()) return false;
  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length || !safeEqual(signature, sign(encodedPayload))) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    return payload.role === "analytics_admin" && Number.isInteger(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const requireAnalyticsAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSession(token)) redirect("/admin/login");
  return { role: "analytics_admin" as const };
});
