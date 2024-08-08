import { 
  units, 
  userProgress, 
  courses, 
  challengeProgress, 
  lessons, 
  userSubscription,
  quests,
  userSettings
} from '@/db/schema';
import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getCourses = cache(async() => {
  const data = await db.query.courses.findMany()

  return data
})

export const getUserProgress = cache(async() => {
  const {userId} = await auth()

  if(!userId) return null

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true
    }
  })

  return data;
})

export const getCourseById = cache(async (courseId: string) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, {asc}) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, {asc}) => [asc(lessons.order)],
          }
        }
      }
    }
  })

  return data
})

export const getUnits = cache(async () => {
  // Fetch user progress data
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  // If there's no active course ID, return an empty array
  if (!userId || !userProgress?.activeCourseId) return [];

  // Fetch units data along with lessons, challenges, and challenge progress
  const data = await db.query.units.findMany({
    orderBy: (units, {asc}) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, {asc}) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, {asc}) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  });

  // Normalize the data and add a completed status to each lesson
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if(lesson.challenges.length === 0){
        return { ...lesson, completed: false };
      }
      // Check if all challenges in the lesson are completed
      const allChallengesCompleted = lesson.challenges.every((challenge) => {
        return challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed);
      });

      // Add a 'completed' property to the lesson
      return { ...lesson, completed: allChallengesCompleted };
    });
    // Return the unit with the updated lessons
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if(!userId || !userProgress?.activeCourseId) return null;

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, {asc}) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, {asc}) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              }
            }
          }
        }
      }
    }
  })

  const firstUncompleteLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return !challenge.challengeProgress 
          || challenge.challengeProgress.length === 0 
          || challenge.challengeProgress.some((progress) => !progress.completed)
      })
  })

  return {
    activeLesson: firstUncompleteLesson,
    activeLessonId: firstUncompleteLesson?.id,
  }
})

export const getLesson = cache(async (id?: string) => {
  const { userId } = await auth();

  if(!userId) return null;

  const courseProgress = await getCourseProgress();
  const lessonId = id || courseProgress?.activeLessonId;

  if(!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, {asc}) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId)
          }
        }
      }
    }
  })

  if(!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress 
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every((progress) => progress.completed)

      return { ...challenge, completed }
  })

  return { ...data, challenges: normalizedChallenges }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson || !lesson.challenges) {
    return 0;
  }

  const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);

  const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

  return percentage
});

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getUserSubscriptions = cache(async () => {
  const { userId } = await auth();

  if(!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId)
  })

  if(!data) return null;

  const isActive = 
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
  
  return { 
    ...data, 
    isActive: !!isActive 
  }
})

export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  if(!userId) return [];

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, {desc}) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true
    }
  })

  return data
})

// Get quests
export const getQuests = async () => {
  const { userId } = auth();

  if(!userId) return [];

  const data = await db.query.quests.findMany({
    orderBy: (quests, {asc}) => [asc(quests.expiredTime)],
  })

  const normalizedData = data.filter((quest) => quest.completed === false && quest.expiredTime > new Date())

  return normalizedData
}

export const getLanguageSetting = async() => {
  const { userId } = auth();

  if(!userId) return null;

  try {
    const data = await db.query.userSettings.findFirst();
    console.log("Language setting data:", data); // Add this line for debugging
    return data;
  } catch (error) {
    console.error("Error fetching language settings:", error);
    return null;
  }
}