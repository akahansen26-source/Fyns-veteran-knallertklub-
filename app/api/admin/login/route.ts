import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin", "1", { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
