import { NextResponse } from 'next/server';
import db from "@/db/drizzle";
import { quests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from '@/lib/admin';
import { create } from 'domain';

export const GET = async (
  req: Request,
  { params } : { params: { questId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.query.quests.findFirst({
      where: eq(quests.id, params.questId)
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching lesson with ID ${params.questId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const PUT = async (
  req: Request,
  { params } : { params: { questId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();

    const updatedQuestData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      createdAt: body.createdAt ? new Date(body.createdAt) : null,
    };

    const data = await db.update(quests).set(updatedQuestData).where(eq(quests.id, params.questId)).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(`Error updating lesson with ID ${params.questId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const DELETE = async (
  req: Request,
  { params } : { params: { questId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.delete(quests).where(eq(quests.id, params.questId)).returning();
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(`Error deleting lesson with ID ${params.questId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
