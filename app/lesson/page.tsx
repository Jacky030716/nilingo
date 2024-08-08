import { getLanguageSetting, getLesson, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from './Quiz'

const LessonPage = async () => {
  const lessonData = getLesson()
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

  if(!language) return 0

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100

  return (
    <div>
      <Quiz 
        initialLessonId={lesson.id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.hearts}
        initialPercentage={initialPercentage}
        userSubscription={userSubs}
        languageIndex={language?.language}
      />
    </div>
  )
}

export default LessonPage