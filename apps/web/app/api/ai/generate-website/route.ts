import { NextResponse } from "next/server";

/** Legacy endpoint — cinematic pipeline is the only supported generation path. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct website generation is deprecated. Use the cinematic pipeline at Dashboard → Create Website.",
      redirectTo: "/dashboard?view=generate-website",
    },
    { status: 410 },
  );
}
