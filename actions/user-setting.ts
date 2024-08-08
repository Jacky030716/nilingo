"use server"

import { eq } from 'drizzle-orm';
import db from "@/db/drizzle"
import { userSettings } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const updateUserLanguageSetting = async (voiceIndex: number) => {
  const { userId } = auth()

  if(!userId){
    throw new Error("Unauthorized");
  }

  await db.update(userSettings).set({
    language: voiceIndex
  }).where(eq(userSettings.userId, (userId)))

  revalidatePath("/setting")
  revalidatePath("/lesson")
  revalidatePath("/learn")
}