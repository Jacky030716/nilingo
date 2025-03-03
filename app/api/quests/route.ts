import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { quests, userQuestsProgress } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { v4 as uuidv4 } from 'uuid';
import { getAllActiveUserIds } from "@/db/queries";

export const GET = async () => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const data = await db.query.quests.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  if(!isAdmin()) return new NextResponse("Unauthorized", { status: 401 })

  const userIds = await getAllActiveUserIds()
  const questId = uuidv4()
  const body = await req.json()

  const questData = {
    id: questId,
    ...body,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
  }

  const data = await db.insert(quests).values(questData).returning()

  const userQuestsProgressPromises = userIds.map((userId: string) => {
    return db.insert(userQuestsProgress).values({
      id: uuidv4(),
      userId,
      questId: questId,
    });
  });

  await Promise.all(userQuestsProgressPromises)

  return NextResponse.json(data)
}