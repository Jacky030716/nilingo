"use server"

import db from "@/db/drizzle"
import { getUserProgress } from "@/db/queries"
import { userProgress, userQuestsProgress, quests } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const updateQuestProgress = async (questId: string) => {
  const { userId } = auth()

  if(!userId){
    throw new Error("Unauthorized")
  }

  const currentUserProgress = await getUserProgress()

  if(!currentUserProgress){
    throw new Error("User Progress Not Found")
  }

  const quest = await db.query.quests.findFirst({
    where: eq(quests.id, questId)
  })

  if(!quest){
    throw new Error("Quest Not Found")
  }

  await db.update(userQuestsProgress).set({
    completed: true
  }).where(
    and(
      eq(userQuestsProgress.userId, userId),
      eq(userQuestsProgress.questId, questId)
    )
  )

  await db.update(userProgress).set({
    points: currentUserProgress.points + quest.rewardPoints,
    experience: currentUserProgress?.experience + quest.rewardExp
  }).where(
    eq(userProgress.userId, userId)
  )

  revalidatePath("/quests")
  revalidatePath("/leaderboard")
  revalidatePath("/learn")
  revalidatePath("/shop")
}