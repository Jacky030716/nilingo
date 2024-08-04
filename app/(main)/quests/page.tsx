import FeedWrapper from '@/components/FeedWrapper'
import Promo from '@/components/Promo'
import StickyWrapper from '@/components/StickyWrapper'
import { Progress } from '@/components/ui/progress'
import UserProgress from '@/components/UserProgress'
import { quests } from '@/constant'

import { getUserProgress, getUserSubscriptions } from '@/db/queries'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()

  const [
    userProgress,
    userSub
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ])

  if(!userProgress || !userProgress.activeCourse) redirect('/courses')

  const isPro = !!userSub?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress 
          activeCourses={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && (
          <Promo />
        )}
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image 
            src="/assets/adventure.svg"
            alt='Quests'
            height={90}
            width={90}
          />
          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>
            Quests
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Complete quests by earning points
          </p>
          <ul className='w-full'>
            {quests.map((q) => {
              const progress = (userProgress.points / q.value) * 100

              return (
                <div
                  key={q.title}
                  className='flex items-center w-full p-4 gap-x-4 border-t-2'
                >
                  <Image 
                    src="/assets/star.svg"
                    alt='Star'
                    width={60}
                    height={60}
                  />
                  <div className='flex flex-col gap-y-2 w-full'>
                    <p className='text-neutral-700 text-xl font-bold'>
                      {q.title}
                    </p>
                    <Progress value={progress} className='h-3'/>
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LeaderboardPage