import { Button } from '@/components/ui/button'
import React from 'react'

const ButtonsPage = () => {
  return (
    <div className='flex flex-col p-4 space-y-4 max-w-[200px]'>
      <Button>
        Default
      </Button>
      <Button
        variant="primary"
      >
        Primary
      </Button>
      <Button
        variant="primaryOutline"
      >
        Primary Outline
      </Button>
      <Button
        variant="secondary"
      >
        Secondary
      </Button>
      <Button
        variant="secondaryOutline"
      >
        Secondary Outline
      </Button>
    </div>
  )
}

export default ButtonsPage