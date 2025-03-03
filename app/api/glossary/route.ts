import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { glossary } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { v4 as uuidv4 } from 'uuid';

export const GET = async () => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.query.glossary.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()

  const data = await db.insert(glossary).values({
    id: uuidv4(),
    ...body,
  }).returning()

  return NextResponse.json(data[0])
}