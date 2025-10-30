function getFileExtension(url: string): string {
  const parsed = url.split("?")[0]; // drop query params
  const parts = parsed.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

type FileType = "pdf" | "image" | "other";

export function detectFileType(url: string): FileType {
  const ext = getFileExtension(url);
  if (ext === "pdf") return "pdf";
  // common image extensions
  if (["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"].includes(ext))
    return "image";
  return "other";
}
