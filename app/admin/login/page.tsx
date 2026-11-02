"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <div className="login-wrap">
      <form action={action} className="login-card">
        <img src="/logo.png" alt="Fyns Veteranknallert Klub" />
        <h1>Admin</h1>
        <label className="field">
          <span className="label">Kodeord</span>
          <div className="pw-wrap">
            <input
              type={show ? "text" : "password"}
              name="password"
              autoFocus
              required
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="button" className="pw-toggle" onClick={() => setShow(!show)}>
              {show ? "Skjul" : "Vis"}
            </button>
          </div>
        </label>
        {error && (
          <p className="error-text">
            {error}
            {error === "Forkert kodeord" && (
              <small className="hint" style={{ display: "block", fontWeight: 400 }}>
                Tryk &quot;Vis&quot; og tjek store/små bogstaver.
              </small>
            )}
          </p>
        )}
        <button className="btn btn-red btn-block" disabled={pending}>
          {pending ? "Logger ind…" : "Log ind"}
        </button>
        <Link href="/" className="back">← Tilbage til hjemmesiden</Link>
      </form>
    </div>
  );
}
