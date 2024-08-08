import FeedWrapper from '@/components/FeedWrapper'
import StickyWrapper from '@/components/StickyWrapper'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { getLanguageSetting } from '@/db/queries'
import LanguageSetting from './LanguageSetting'

const SettingPage = async () => {
  const languageSettingData = getLanguageSetting()

  const [languageData] = await Promise.all([languageSettingData])

  if (!languageData) {
    return null
  }

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        Temp
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image 
            src="/assets/setting.svg"
            alt='Leaderboard'
            height={90}
            width={90}
          />
          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>
            Settings
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Change your preferences here
          </p>
          <Separator 
            className='mb-4 h-0.5 rounded-full'
          />
          {/* Setting for language spoken */}
          <LanguageSetting
            languageData={languageData}
          />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default SettingPage