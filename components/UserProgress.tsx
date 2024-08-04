import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { InfinityIcon } from "lucide-react"
import { courses } from "@/db/schema"

type Props = {
  activeCourses: typeof courses.$inferSelect;
  hearts: number
  points: number
  hasActiveSubscription: boolean
}

const UserProgress = ({
  activeCourses, hearts, points, hasActiveSubscription
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button
          variant="ghost"
        >
          <Image 
            src={activeCourses.src}
            alt={activeCourses.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button
          variant="ghost"
          className="text-orange-500"
        >
          <Image 
            src="/assets/star.svg"
            alt="Points"
            className="mr-1"
            width={24}
            height={24}
          />
          <span className="mt-1">{points}</span>
        </Button>
      </Link>
      <Link href="/shop">
        <Button
          variant="ghost"
          className="text-rose-500"
        >
          <Image 
            src="/assets/heart.svg"
            alt="Points"
            className="mr-1"
            width={28}
            height={28}
          />
          {hasActiveSubscription ? <InfinityIcon className="h-4 w-4 stroke-[3]"/> : hearts}
        </Button>
      </Link>
    </div>
  )
}

export default UserProgress