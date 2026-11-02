"use client";

/** Formindsker billedet i browseren og sender det til serveren. Returnerer billedets id. */
export async function uploadImage(file: File, opts: { gallery?: boolean; caption?: string } = {}): Promise<number> {
  const { data, mime } = await shrink(file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, mime, data, gallery: !!opts.gallery, caption: opts.caption ?? "" }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload fejlede");
  return json.id;
}

const MAX_SIDE = 1800;

async function shrink(file: File): Promise<{ data: string; mime: string }> {
  // GIF'er (evt. animerede) sendes uændret
  if (file.type === "image/gif") return { data: await toBase64(file), mime: file.type };

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Filen kunne ikke læses som et billede");

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  // PNG beholdes som PNG (gennemsigtighed, f.eks. logo) – resten bliver JPEG
  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Kunne ikke behandle billedet"))), mime, 0.85)
  );
  return { data: await toBase64(blob), mime };
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
