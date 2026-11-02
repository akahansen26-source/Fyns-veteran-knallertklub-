"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <div className="login-wrap">
      <form action={action} className="login-card">
        <img src="/logo.png" alt="Fyns Veteranknallert Klub" />
        <h1>Admin</h1>
        <label className="field">
          <span className="label">Kodeord</span>
          <input type="password" name="password" autoFocus required autoComplete="current-password" />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-red btn-block" disabled={pending}>
          {pending ? "Logger ind…" : "Log ind"}
        </button>
        <Link href="/" className="back">← Tilbage til hjemmesiden</Link>
      </form>
    </div>
  );
}
