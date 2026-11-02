"use client";

import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAuthed(true);
    else setMessage("Forkert kodeord");
  };

  const addEvent = async () => {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, time, location, description }),
    });
    if (res.ok) {
      setMessage("Arrangement tilføjet!");
      setTitle(""); setDate(""); setTime(""); setLocation(""); setDescription("");
    } else setMessage("Fejl ved oprettelse");
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Kodeord"
        />
        <button onClick={login} className="bg-red-600 text-white px-4 py-2">Log ind</button>
        {message && <p className="mt-2 text-red-600">{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rediger arrangementer</h1>
      <div className="space-y-3 max-w-lg">
        <input className="border p-2 w-full" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Dato (f.eks. 13.3.2026)" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Tid" value={time} onChange={(e) => setTime(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Sted" value={location} onChange={(e) => setLocation(e.target.value)} />
        <textarea className="border p-2 w-full" placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <button onClick={addEvent} className="bg-yellow-400 px-4 py-2 font-semibold">Tilføj arrangement</button>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  );
}
