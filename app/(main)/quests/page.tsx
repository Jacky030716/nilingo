import FeedWrapper from '@/components/FeedWrapper'
import Promo from '@/components/Promo'
import StickyWrapper from '@/components/StickyWrapper'
import { Progress } from '@/components/ui/progress'
import UserProgress from '@/components/UserProgress'

import { getQuests, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import { formatDistance, formatDistanceToNow, subDays } from 'date-fns'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()
  const questData = getQuests()

  const [
    userProgress,
    userSub,
    quests
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    questData
  ])

  if(!userProgress || !userProgress.activeCourse) redirect('/courses')
  
  if(!quests) return []

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
              const progress = (userProgress.points / q.points) * 100
              const remainingDay = formatDistanceToNow(q.expiredTime, {
                addSuffix: true
              })

              return (
                <div
                  key={q.title}
                  className='flex items-center w-full p-4 gap-x-4 border-t-2'
                >
                  <Image 
                    src="/assets/star.svg"
                    alt='Star'
                    width={45}
                    height={45}
                  />
                  <div className='flex flex-col gap-y-2 w-full'>
                    <div className='flex justify-between items-center'>
                      <p className='text-neutral-700 text-lg font-bold flex justify-between items-center'>
                        {q.title}
                      </p>
                      <p className='text-md font-light text-neutral-500'>
                        ends {remainingDay}
                      </p>
                    </div>
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