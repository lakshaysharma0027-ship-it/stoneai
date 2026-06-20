import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "cinematic-media";
const MAX_BYTES = 50 * 1024 * 1024;

const extensionFor = (filename: string, contentType: string) => {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("pdf")) return "pdf";
  return "bin";
};

async function ensureBucket(admin: ReturnType<typeof createSupabaseAdminClient>) {
  const { data: buckets } = await admin.storage.listBuckets();
  if (buckets?.some((bucket) => bucket.id === BUCKET)) return;

  await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/webm",
    ],
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      kind?: string;
      filename?: string;
      contentType?: string;
      size?: number;
    };

    const kind = payload.kind?.trim();
    const filename = payload.filename?.trim() || "upload.bin";
    const contentType = payload.contentType?.trim() || "application/octet-stream";
    const size = payload.size ?? 0;

    if (!kind || !["hero", "last-frame", "video", "prompt-reference"].includes(kind)) {
      return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
    }

    const maxBytes =
      kind === "prompt-reference"
        ? 10 * 1024 * 1024
        : kind === "video"
          ? MAX_BYTES
          : 10 * 1024 * 1024;

    if (size <= 0 || size > maxBytes) {
      return NextResponse.json(
        { error: `File must be between 1 byte and ${maxBytes / (1024 * 1024)} MB.` },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to upload media." }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();
    await ensureBucket(admin);

    const ext = extensionFor(filename, contentType);
    const path = `${user.id}/uploads/${crypto.randomUUID()}/${kind}.${ext}`;

    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      throw error ?? new Error("Could not create upload URL.");
    }

    const { data: publicData } = admin.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      publicUrl: publicData.publicUrl,
      path,
      contentType,
    });
  } catch (error) {
    console.error("[StoneAI pipeline upload url] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not prepare upload." },
      { status: 500 },
    );
  }
}
