import FeedWrapper from '@/components/FeedWrapper'
import Promo from '@/components/Promo'
import Quests from '@/components/Quests'
import StickyWrapper from '@/components/StickyWrapper'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import UserProgress from '@/components/UserProgress'

import { getTopTenUsers, getUserProgress, getUserSubscriptions } from '@/db/queries'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()
  const leaderboardData = getTopTenUsers()

  const [
    userProgress,
    userSub,
    leaderboard
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData
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
        <Quests 
          points={userProgress.points}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image 
            src="/assets/leaderboard.svg"
            alt='Leaderboard'
            height={90}
            width={90}
          />
          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>
            Leaderboard
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            See where you stand among other learners
          </p>
          <Separator 
            className='mb-4 h-0.5 rounded-full'
          />
          {leaderboard.map((user, i) => (
            <div 
              key={user.userId}
              className='flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50'
            >
              <p className='font-bold text-lime-700 mr-4'>{i + 1}</p>
              <Avatar
                className='bg-emerald-500 h-12 w-12 ml-3 mr-6'
              >
                <AvatarImage 
                  src={user.userImageSrc}
                  className='object-cover'
                />
              </Avatar>
              <p className='font-bold text-neutral-800 flex-1'>
                {user.userName}
              </p>
              <p className='text-muted-foreground'>
                {user.points} points
              </p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LeaderboardPage