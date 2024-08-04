import { NextResponse } from 'next/server';
import db from "@/db/drizzle"
import { challenges } from "@/db/schema"
import { eq } from "drizzle-orm"
import { isAdmin } from '@/lib/admin';

export const GET = async (
  req: Request,
  { params } : { params: { challengeId: number }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.query.courses.findFirst({
    where: eq(challenges.id, params.challengeId)
  })

  return NextResponse.json(data)
}

export const PUT = async (
  req: Request,
  { params } : { params: { challengeId: number }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const data = await db.update(challenges).set({
    ...body,
  }).where(eq(challenges.id, params.challengeId)).returning()

  return NextResponse.json(data[0])
}

export const DELETE = async (
  req: Request,
  { params } : { params: { challengeId: number }}
) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.delete(challenges).where(eq(challenges.id, params.challengeId)).returning()

  return NextResponse.json(data[0])
}