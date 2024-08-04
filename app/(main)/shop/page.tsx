import FeedWrapper from '@/components/FeedWrapper'
import StickyWrapper from '@/components/StickyWrapper'
import UserProgress from '@/components/UserProgress'

import { getUserProgress, getUserSubscriptions } from '@/db/queries'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import Items from './Items'
import Quests from '@/components/Quests'

const ShopPage = async () => {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscriptions()

  const [
    userProgress,
    userSub
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData
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
        <Quests 
          points={userProgress.points}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image 
            src="/assets/shop.svg"
            alt='Shop'
            height={90}
            width={90}
          />
          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>
            Shop
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Spend your points to buy some cool stuff
          </p>
          <Items 
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default ShopPage