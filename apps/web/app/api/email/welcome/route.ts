import { NextResponse } from "next/server";
import { emailService } from "@/services/email/emailService";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    to?: string;
    fullName?: string | null;
  };

  if (!payload.to) {
    return NextResponse.json({ error: "Missing recipient." }, { status: 400 });
  }

  await emailService.sendWelcomeEmail({
    to: payload.to,
    fullName: payload.fullName,
    actionUrl: new URL("/", request.url).toString(),
  });

  return NextResponse.json({ ok: true });
}
