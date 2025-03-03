import { getLanguageSetting, getLesson, getLessonGlossary, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from './Quiz'

const LessonPage = async () => {
  const lessonData = getLesson()
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()
  const languageData = getLanguageSetting()
  const lessonGlossaryData = getLessonGlossary()

  const [lesson, userProgress, userSubs, language, lessonGlossary] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
    languageData,
    lessonGlossaryData
  ])

  if(!lesson || !userProgress || !lessonGlossary){
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
        glossary={lessonGlossary}
      />
    </div>
  )
}

export default LessonPage