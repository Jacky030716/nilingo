import FeedWrapper from '@/components/FeedWrapper'
import Promo from '@/components/Promo'
import StickyWrapper from '@/components/StickyWrapper'
import UserProgress from '@/components/UserProgress'

import { getQuests, getUserProgress, getUserSubscriptions } from '@/db/queries'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QuestItemBox from './QuestItemBox'

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
          <div className='w-full flex justify-center'>
            <Tabs defaultValue="COMMON" className='w-full'>
              <TabsList
                className='flex justify-center gap-x-4'
              >
                <TabsTrigger value="DAILY">Daily</TabsTrigger>
                <TabsTrigger value="COMMON">Common</TabsTrigger>
                <TabsTrigger value="EPIC">Epic</TabsTrigger>
              </TabsList>
              {quests.map((q) => (
                <TabsContent key={q.id} value={q.quest.category}>
                  <QuestItemBox 
                    userProgress={userProgress}
                    quest={q.quest}
                    value={q.quest.category}
                    completed={q.completed}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LeaderboardPage