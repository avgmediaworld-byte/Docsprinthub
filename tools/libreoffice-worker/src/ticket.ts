import { createHmac, timingSafeEqual } from "node:crypto";

export const MAX_TICKET_LIFETIME_SECONDS = 5 * 60;

export type ConversionTicketPayload = {
  v: 1;
  conversion: "docx-to-pdf";
  iat: number;
  exp: number;
  maxBytes: number;
  declaredBytes: number;
  ticketId: string;
  filename: string;
};

export class ConversionTicketError extends Error {
  constructor() {
    super("A valid conversion ticket is required.");
    this.name = "ConversionTicketError";
  }
}

function encodedSignature(signedPart: string, secret: string) {
  return createHmac("sha256", secret).update(signedPart).digest("base64url");
}

function isSafePositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isTicketPayload(value: unknown, nowSeconds: number): value is ConversionTicketPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  if (payload.v !== 1 || payload.conversion !== "docx-to-pdf") return false;
  if (!isSafePositiveInteger(payload.iat) || !isSafePositiveInteger(payload.exp)) return false;
  if (payload.exp <= nowSeconds || payload.iat > nowSeconds + 30 || payload.exp - payload.iat > MAX_TICKET_LIFETIME_SECONDS) return false;
  if (!isSafePositiveInteger(payload.maxBytes) || !isSafePositiveInteger(payload.declaredBytes) || payload.declaredBytes > payload.maxBytes) return false;
  if (typeof payload.ticketId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.ticketId)) return false;
  if (typeof payload.filename !== "string" || payload.filename.length > 255 || !/\.docx$/i.test(payload.filename) || /[\\/\r\n\0]/.test(payload.filename)) return false;
  return true;
}

/** Shared wire format with the Vercel ticket issuer: v1.<base64url-json>.<base64url-hmac>. */
export function issueConversionTicket(payload: ConversionTicketPayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signedPart = `v1.${encodedPayload}`;
  return `${signedPart}.${encodedSignature(signedPart, secret)}`;
}

export function verifyConversionTicket(ticket: string | string[] | undefined, secret: string, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof ticket !== "string" || !secret || secret.length < 32) throw new ConversionTicketError();
  const parts = ticket.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^[A-Za-z0-9_-]+$/.test(parts[1]) || !/^[A-Za-z0-9_-]+$/.test(parts[2])) {
    throw new ConversionTicketError();
  }

  const signedPart = `${parts[0]}.${parts[1]}`;
  const expectedSignature = Buffer.from(encodedSignature(signedPart, secret), "base64url");
  const receivedSignature = Buffer.from(parts[2], "base64url");
  if (expectedSignature.length !== receivedSignature.length || !timingSafeEqual(expectedSignature, receivedSignature)) {
    throw new ConversionTicketError();
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as unknown;
    if (!isTicketPayload(payload, nowSeconds)) throw new ConversionTicketError();
    return payload;
  } catch (error) {
    if (error instanceof ConversionTicketError) throw error;
    throw new ConversionTicketError();
  }
}
