"use client";

import { useRef, useState } from "react";
import { marked } from "marked";
import { uploadImage } from "./upload";

type Tool = { label: string; title: string; before: string; after?: string; placeholder?: string; line?: boolean };

const TOOLS: Tool[] = [
  { label: "Overskrift", title: "Overskrift", before: "## ", placeholder: "Overskrift", line: true },
  { label: "B", title: "Fed skrift", before: "**", after: "**", placeholder: "fed tekst" },
  { label: "I", title: "Kursiv", before: "*", after: "*", placeholder: "kursiv tekst" },
  { label: "• Liste", title: "Punktliste", before: "- ", placeholder: "punkt", line: true },
  { label: "Link", title: "Indsæt link", before: "[", after: "](https://)", placeholder: "linktekst" },
];

export default function MarkdownEditor({
  name,
  defaultValue = "",
  rows = 14,
  label = "Tekst",
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);

  function insert(before: string, after = "", placeholder = "", line = false) {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const needsNewline = line && s > 0 && value[s - 1] !== "\n" ? "\n" : "";
    const text = needsNewline + before + selected + after;
    const next = value.slice(0, s) + text + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const start = s + needsNewline.length + before.length;
      el.setSelectionRange(start, start + selected.length);
    });
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      const id = await uploadImage(f);
      insert(`\n![${f.name.replace(/\.[^.]+$/, "")}](/billede/${id})\n`, "", "", false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload fejlede");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="md-editor">
        <div className="md-toolbar">
          {TOOLS.map((t) => (
            <button
              key={t.title}
              type="button"
              title={t.title}
              onClick={() => insert(t.before, t.after, t.placeholder, t.line)}
              disabled={preview}
            >
              {t.label}
            </button>
          ))}
          <button type="button" onClick={() => file.current?.click()} disabled={preview || busy} title="Indsæt billede">
            {busy ? "Uploader…" : "Billede"}
          </button>
          <span className="spacer" />
          <button type="button" className={preview ? "active" : ""} onClick={() => setPreview(!preview)}>
            {preview ? "Rediger" : "Forhåndsvis"}
          </button>
        </div>
        {preview ? (
          <div
            className="prose md-preview"
            dangerouslySetInnerHTML={{ __html: marked.parse(value.replace(/</g, "&lt;"), { breaks: true, async: false }) as string }}
          />
        ) : (
          <textarea ref={ta} rows={rows} value={value} onChange={(e) => setValue(e.target.value)} />
        )}
        <input type="hidden" name={name} value={value} />
        <input ref={file} type="file" accept="image/*" hidden onChange={onImage} />
      </div>
      <small className="hint">Tip: tom linje = nyt afsnit. Markér tekst og tryk på en knap for at formatere.</small>
    </div>
  );
}
