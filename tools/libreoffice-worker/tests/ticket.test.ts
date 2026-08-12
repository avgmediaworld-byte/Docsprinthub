import assert from "node:assert/strict";
import { issueConversionTicket, verifyConversionTicket } from "../src/ticket";

const secret = "test-conversion-ticket-secret-with-at-least-32-characters";
const now = 1_800_000_000;

function payload(overrides: Partial<Parameters<typeof issueConversionTicket>[0]> = {}) {
  return {
    v: 1 as const,
    conversion: "docx-to-pdf" as const,
    iat: now - 30,
    exp: now + 60,
    maxBytes: 25 * 1024 * 1024,
    declaredBytes: 1234,
    ticketId: "7bcb1492-4f72-45bd-bdd3-a10278693bb7",
    filename: "example.docx",
    ...overrides,
  };
}

const ticket = issueConversionTicket(payload(), secret);
assert.deepEqual(verifyConversionTicket(ticket, secret, now), payload());
assert.throws(() => verifyConversionTicket(ticket, "other-ticket-secret-with-at-least-32-characters", now));
assert.throws(() => verifyConversionTicket(ticket.replace(/.$/, "x"), secret, now));
assert.throws(() => verifyConversionTicket(issueConversionTicket(payload({ exp: now }), secret), secret, now));
assert.throws(() => verifyConversionTicket(issueConversionTicket(payload({ conversion: "pdf-to-docx" as "docx-to-pdf" }), secret), secret, now));
assert.throws(() => verifyConversionTicket(issueConversionTicket(payload({ declaredBytes: 30 * 1024 * 1024 }), secret), secret, now));

console.log("Conversion ticket tests passed.");
