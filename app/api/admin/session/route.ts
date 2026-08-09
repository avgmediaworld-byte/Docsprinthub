import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession, isAdminAuthConfigured, verifyAdminPassword } from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function noStoreJson(body: Record<string, string>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function validSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!validSameOrigin(request)) return noStoreJson({ message: "Invalid request origin." }, 403);
  if (!isAdminAuthConfigured()) return noStoreJson({ message: "Admin authentication has not been configured." }, 503);

  try {
    const body = await request.json() as { password?: unknown };
    const password = typeof body.password === "string" ? body.password.slice(0, 512) : "";
    if (!verifyAdminPassword(password)) return noStoreJson({ message: "Invalid password." }, 401);

    const session = createAdminSession();
    const response = noStoreJson({ message: "Authenticated." }, 200);
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: session.token,
      httpOnly: true,
      maxAge: session.maxAge,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch {
    return noStoreJson({ message: "Invalid sign-in request." }, 400);
  }
}

export async function DELETE(request: NextRequest) {
  if (!validSameOrigin(request)) return noStoreJson({ message: "Invalid request origin." }, 403);
  const response = noStoreJson({ message: "Signed out." }, 200);
  response.cookies.set({ name: ADMIN_SESSION_COOKIE, value: "", httpOnly: true, maxAge: 0, path: "/", sameSite: "strict", secure: process.env.NODE_ENV === "production" });
  return response;
}
