"use server"

import db from "@/db/drizzle"
import { getUserProgress, getUserSubscriptions } from "@/db/queries"
import { challengeProgress, challenges, userProgress } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export const upsertChallengeProgress = async (challengeId: string) => {
  const { userId } = auth()

  if(!userId){
    throw new Error("Unauthorized")
  }

  const currentUserProgress = await getUserProgress()
  const userSubscription = await getUserSubscriptions()

  if(!currentUserProgress){
    throw new Error("User Progress Not Found")
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  })

  if(!challenge){
    throw new Error("Challenge Not Found")
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    )
  })

  const isPractice = !!existingChallengeProgress;

  if(currentUserProgress.hearts === 0 
    && !isPractice 
    && !userSubscription?.isActive){
    return { error: "hearts"}
  }

  if(isPractice){
    await db.update(challengeProgress).set({
      completed: true,
    }).where
      (eq(challengeProgress.id, existingChallengeProgress.id)
    )

    await db.update(userProgress).set({
      hearts: Math.min(currentUserProgress.hearts + 1, 5),
      points: currentUserProgress.points + 10
    }).where(eq(userProgress.userId, userId))

    revalidatePath('/learn')
    revalidatePath('/lesson')
    revalidatePath('/quests')
    revalidatePath('/leaderboard')
    revalidatePath(`/lesson/${lessonId}`)
    return;
  }

  await db.insert(challengeProgress).values({
    id: uuidv4(),
    challengeId,
    userId,
    completed: true
  })

  await db.update(userProgress).set({
    points: currentUserProgress.points + 10,
  }).where(eq(userProgress.userId, userId))

  revalidatePath('/learn')
  revalidatePath('/lesson')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
  revalidatePath(`/lesson/${lessonId}`)
}