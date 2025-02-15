import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(req: NextRequest) {
  // Uncomment this line to use a database
  const { searchParams } = req.nextUrl
  const { page, pageSize } = Object.fromEntries(searchParams.entries());

  try {
  const data = await db.
    select()
    .from(advocates)
    .limit(Number(pageSize))
    .offset((Number(page) - 1) * Number(pageSize));

  return Response.json({ data });
  } catch (e) {
   console.error(e);
   return Response.json({ ok: false })
  }
}
