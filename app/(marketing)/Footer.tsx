import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Flag from 'react-flagpack'

const Footer = () => {
  return (
    <footer className='hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2'>
      <div className='max-w-screen-lg mx-auto flex items-center justify-evenly h-full'>
        <Button
          size="lg"
          variant="ghost"
          className='w-full'
        >
          <Image 
            src="/assets/my.svg"
            alt='Malaysia'
            height={32}
            width={40}
            className='mr-4 rounded-md'
          />
          Malaysia
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className='w-full'
        >
          <Image 
            src="/assets/jp.svg"
            alt='Japan'
            height={32}
            width={40}
            className='mr-4 rounded-md'
          />
          Japan
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className='w-full'
        >
          <Image 
            src="/assets/kr.svg"
            alt='Korea'
            height={32}
            width={40}
            className='mr-4 rounded-md'
          />
          Korea
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className='w-full'
        >
          <Image 
            src="/assets/cn.svg"
            alt='China'
            height={32}
            width={40}
            className='mr-4 rounded-md'
          />
          China
        </Button>
      </div>
    </footer>
  )
}

export default Footer