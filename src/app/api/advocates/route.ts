import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { bigint, index, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { asc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  // Uncomment this line to use a database
  const { searchParams } = req.nextUrl
  const { page, pageSize, searchText } = Object.fromEntries(searchParams.entries());

  try {
    const advocatesData = pgTable(
      'advocates',
      {
        id: serial('id').primaryKey(),
        firstName: text('first_name').notNull(),
        lastName: text('last_name').notNull(),
        city: text("city").notNull(),
        degree: text("degree").notNull(),
        specialties: jsonb("payload").default([]).notNull(),
        yearsOfExperience: integer("years_of_experience").notNull(),
        phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
      },
      (table) => [
        index('search_index').using(
          'gin',
          sql`(
              setweight(to_tsvector('english', ${table.firstName}), 'A') ||
              setweight(to_tsvector('english', ${table.lastName}), 'B')
          )`,
        ),
      ],
    );

    const searchQuery = sql`(
      setweight(to_tsvector('english', ${advocatesData.firstName}), 'A') ||
      setweight(to_tsvector('english', ${advocatesData.lastName}), 'B'))
      @@ to_tsquery('english', ${searchText}
    )`;

    const data = await db
      .select()
      .from(advocatesData)
      .where(!!searchText && searchText?.length > 0 ? searchQuery : '')
      .orderBy(asc(advocates.id))
      .limit(Number(pageSize))
      .offset((Number(page) - 1) * Number(pageSize));

    return Response.json({ data });
  } catch (e) {
   console.error(e);
   return Response.json({ ok: false })
  }
}
