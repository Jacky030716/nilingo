import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async () => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const data = await db.query.lessons.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const POST = async (req: Request) => {
  try {
    if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const data = await db.insert(lessons).values({
      ...body,
    }).returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating lesson:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
