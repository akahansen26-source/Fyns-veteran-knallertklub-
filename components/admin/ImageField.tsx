"use client";

import { useRef, useState } from "react";
import { uploadImage } from "./upload";

/** Vælg/skift/fjern ét billede. Gemmer billedets id i et skjult felt. */
export default function ImageField({
  name,
  defaultValue,
  label = "Billede",
  fallback,
}: {
  name: string;
  defaultValue?: number | string | null;
  label?: string;
  fallback?: string;
}) {
  const [id, setId] = useState<string>(defaultValue ? String(defaultValue) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      setId(String(await uploadImage(file)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload fejlede");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const src = id ? `/billede/${id}` : fallback;
  return (
    <div className="field">
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={id} />
      <div className="image-field">
        {src ? <img src={src} alt="" /> : <div className="image-empty">Intet billede</div>}
        <div className="image-buttons">
          <button type="button" className="btn btn-small" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "Uploader…" : id ? "Skift billede" : "Vælg billede"}
          </button>
          {id && (
            <button type="button" className="btn btn-small btn-ghost" onClick={() => setId("")}>
              Fjern
            </button>
          )}
          {err && <span className="error-text">{err}</span>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={onPick} />
    </div>
  );
}
