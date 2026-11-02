"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadImage } from "./upload";

export default function GalleryUploader() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    let ok = 0;
    const errors: string[] = [];
    for (const [i, f] of files.entries()) {
      setStatus(`Uploader ${i + 1} af ${files.length}…`);
      try {
        await uploadImage(f, { gallery: true });
        ok++;
      } catch (err) {
        errors.push(`${f.name}: ${err instanceof Error ? err.message : "fejl"}`);
      }
    }
    setStatus(`${ok} billede${ok === 1 ? "" : "r"} uploadet.${errors.length ? " Fejl: " + errors.join("; ") : ""}`);
    router.refresh();
  }

  return (
    <div className="uploader">
      <button type="button" className="btn btn-red" onClick={() => input.current?.click()}>
        + Upload billeder
      </button>
      <span className="muted">Du kan vælge flere på én gang. Store billeder formindskes automatisk.</span>
      {status && <p className="notice">{status}</p>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={onPick} />
    </div>
  );
}
