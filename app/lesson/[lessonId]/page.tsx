import { getLanguageSetting, getLesson, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from '../Quiz'

type Props = {
  params: {
    lessonId: string
  }
}

const LessonIdPage = async ({
  params
}: Props) => {
  const lessonData = getLesson(params.lessonId)
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()
  const languageData = getLanguageSetting()

  const [lesson, userProgress, userSubs, language] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
    languageData
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
      languageIndex={language?.language}
    />
  )
}

export default LessonIdPage