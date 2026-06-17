export async function resolveInlineImage(
  url: string,
): Promise<{ imageBytes: string; mimeType: string } | undefined> {
  const dataMatch = url.match(/^data:([^;]+);base64,(.+)$/);
  if (dataMatch?.[1] && dataMatch[2]) {
    return { mimeType: dataMatch[1], imageBytes: dataMatch[2] };
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/png";
    const imageBytes = Buffer.from(await response.arrayBuffer()).toString("base64");
    return { imageBytes, mimeType };
  }

  return undefined;
}
