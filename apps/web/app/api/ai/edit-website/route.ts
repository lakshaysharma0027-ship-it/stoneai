import { NextResponse } from "next/server";

/** Legacy endpoint — use /api/ai/pipeline/edit for cinematic scene edits. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Legacy schema edits are deprecated. Use the cinematic pipeline edit from your project dashboard.",
      redirectTo: "/dashboard",
    },
    { status: 410 },
  );
}
