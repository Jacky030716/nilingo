import { NextResponse } from 'next/server';
import db from "@/db/drizzle"
import { glossary } from "@/db/schema"
import { eq } from "drizzle-orm"
import { isAdmin } from '@/lib/admin';

export const GET = async (
  req: Request,
  { params } : { params: { glossaryId: string }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.query.glossary.findFirst({
    where: eq(glossary.id, params.glossaryId)
  })

  return NextResponse.json(data)
}

export const PUT = async (
  req: Request,
  { params } : { params: { glossaryId: string }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const data = await db.update(glossary).set({
    ...body,
  }).where(eq(glossary.id, params.glossaryId)).returning()

  return NextResponse.json(data[0])
}

export const DELETE = async (
  req: Request,
  { params } : { params: { glossaryId: string }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.delete(glossary).where(eq(glossary.id, params.glossaryId)).returning()

  return NextResponse.json(data[0])
}