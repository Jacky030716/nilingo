import { getLesson, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from './Quiz'

const LessonPage = async () => {
  const lessonData = getLesson()
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()

  const [lesson, userProgress, userSubs] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ])

  if(!lesson || !userProgress){
    redirect('/learn')
  }

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100

  return (
    <Quiz 
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubs}
    />
  )
}

export default LessonPage