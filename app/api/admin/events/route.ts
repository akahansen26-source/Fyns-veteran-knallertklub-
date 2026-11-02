import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await db.insert(events).values({
    title: body.title,
    date: body.date,
    time: body.time || null,
    location: body.location || null,
    description: body.description || null,
  });

  return NextResponse.json({ ok: true });
}
