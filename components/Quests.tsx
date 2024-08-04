"use client"

import { quests } from "@/constant"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

type Props = {
  points: number
}

const Quests = ({ points }: Props) => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full space-y-2">
        <h3 className="font-bold text-lg">Quests</h3>
        <Link href="/quests">
          <Button
            variant="primaryOutline"
            size="sm"
          >
            View all quests
          </Button>
        </Link>
      </div>
      <ul className="w-full space-y-4">
        {quests.map((q) => {
          const progress = (points / q.value) * 100

          return (
            <div
              key={q.title}
              className='flex items-center w-full pb-4 gap-x-4'
            >
              <Image 
                src="/assets/star.svg"
                alt='Star'
                width={40}
                height={50}
              />
              <div className='flex flex-col gap-y-2 w-full'>
                <p className='text-neutral-700 text-md font-bold'>
                  {q.title}
                </p>
                <Progress value={progress} className='h-1.5'/>
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default Quests