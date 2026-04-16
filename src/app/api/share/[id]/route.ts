import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();

    const rows = await sql`
      SELECT csv_text, name, created_at
      FROM helix_uploads
      WHERE id = ${id}
    `;

    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const row = rows[0] as { csv_text: string; name: string; created_at: string };
    return NextResponse.json({
      csv_text: row.csv_text,
      name: row.name,
      created_at: row.created_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
