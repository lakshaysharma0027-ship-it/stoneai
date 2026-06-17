export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<{
  response: Response;
  payload: T;
}> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (response.status === 413 || text.toLowerCase().includes("entity too large")) {
      throw new Error(
        "Upload too large for the server. Files are now uploaded to storage first — refresh and try again. Keep video under 50 MB.",
      );
    }
    throw new Error(text.trim() || `Request failed (${response.status}).`);
  }

  const payload = (await response.json()) as T;
  return { response, payload };
}
