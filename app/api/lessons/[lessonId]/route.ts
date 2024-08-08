import { NextResponse } from 'next/server';
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from '@/lib/admin';

export const GET = async (
  req: Request,
  { params } : { params: { lessonId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, params.lessonId)
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching lesson with ID ${params.lessonId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const PUT = async (
  req: Request,
  { params } : { params: { lessonId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = await db.update(lessons).set({
      ...body,
    }).where(eq(lessons.id, params.lessonId)).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(`Error updating lesson with ID ${params.lessonId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const DELETE = async (
  req: Request,
  { params } : { params: { lessonId: string }}
) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.delete(lessons).where(eq(lessons.id, params.lessonId)).returning();
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(`Error deleting lesson with ID ${params.lessonId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
