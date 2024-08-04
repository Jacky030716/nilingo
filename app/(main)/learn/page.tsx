import FeedWrapper from '@/components/FeedWrapper'
import StickyWrapper from '@/components/StickyWrapper'
import React, { useEffect } from 'react'
import Header from './Header'
import UserProgress from '@/components/UserProgress'
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import Unit from './Unit'
import Promo from '@/components/Promo'
import Quests from '@/components/Quests'

const LearningPage = async () => {
  const userProgressData = getUserProgress()
  const unitsData = getUnits()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const userSubscriptionData = getUserSubscriptions()

  const [ userProgress, units, courseProgress, lessonPercentage, userSubs ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData
  ])

  if(!userProgress || !userProgress.activeCourse){
    redirect("/courses")
  }

  if(!courseProgress){
    redirect('/courses')
  }

  const isPro = !!userSubs?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress 
          activeCourses={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubs?.isActive}
        />
        {!isPro && (
          <Promo />
        )}
        <Quests 
          points={userProgress.points}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header 
          title={userProgress.activeCourse.title}
        />
        {units.map((unit) => (
          <div
            key={unit.id}
            className='mb-10'
          >
            <Unit 
              id={unit.id}
              order={unit.order}
              title={unit.title}
              desc={unit.description}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default LearningPage