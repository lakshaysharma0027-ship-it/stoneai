export type PipelineMediaKind = "hero" | "last-frame" | "video";

export const PIPELINE_UPLOAD_LIMITS = {
  imageBytes: 10 * 1024 * 1024,
  videoBytes: 50 * 1024 * 1024,
} as const;

export async function uploadPipelineMedia(
  file: File,
  kind: PipelineMediaKind,
): Promise<string> {
  const init = await fetch("/api/media/pipeline-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
  });

  const payload = (await init.json()) as {
    error?: string;
    uploadUrl?: string;
    publicUrl?: string;
    contentType?: string;
  };

  if (!init.ok || !payload.uploadUrl || !payload.publicUrl) {
    throw new Error(payload.error ?? "Could not prepare media upload.");
  }

  const upload = await fetch(payload.uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": payload.contentType ?? file.type ?? "application/octet-stream",
    },
  });

  if (!upload.ok) {
    throw new Error("Upload to storage failed. Try a smaller file or different format.");
  }

  return payload.publicUrl;
}
