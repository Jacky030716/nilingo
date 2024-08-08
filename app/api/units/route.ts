import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { v4 as uuidv4 } from 'uuid';

export const GET = async () => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.query.units.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  if (!isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  console.log('Creating unit with data:', body);

  const data = await db.insert(units).values({
    id: uuidv4(),
    ...body,
  }).returning();

  console.log('Created unit:', data[0]);

  return NextResponse.json(data[0]);
}
