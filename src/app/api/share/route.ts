import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function POST(req: NextRequest) {
  try {
    const sql = getSql();

    // Ensure table exists (idempotent)
    await sql`CREATE TABLE IF NOT EXISTS helix_uploads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL DEFAULT 'Untitled',
      csv_text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

    const body = await req.json().catch(() => ({}));
    const { csv_text, name } = body as { csv_text?: string; name?: string };

    if (!csv_text) {
      return NextResponse.json({ error: "No CSV" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO helix_uploads (csv_text, name)
      VALUES (${csv_text}, ${name || "Untitled"})
      RETURNING id
    `;

    const id = (rows[0] as { id: string }).id;
    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
