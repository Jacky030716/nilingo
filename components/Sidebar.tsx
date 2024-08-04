import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import SidebarItem from "./SidebarItem"
import { ClerkLoaded, ClerkLoading, SignOutButton, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { Button } from "./ui/button"

type Props = {
  className?: string
}

const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn('flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col', className)}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
            <Image 
              src="/assets/parrot.png"
              height={40}
              width={40}
              alt="Parrot"
            />
            <h1 className="text-2xl font-extrabold text-rose-600 tracking-wide">
              NiLingo
            </h1>
          </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          label="Learn"
          href="/learn"
          iconSrc="/assets/learn.svg"
        />
        <SidebarItem 
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/assets/leaderboard.svg"
        />
        <SidebarItem 
          label="Quests"
          href="/quests"
          iconSrc="/assets/adventure.svg"
        />
        <SidebarItem 
          label="Shop"
          href="/shop"
          iconSrc="/assets/shop.svg"
        />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="w-5 h-5 text-muted-foreground animate-spin"/>
        </ClerkLoading>
        <ClerkLoaded>
          <Button 
            className="w-full"
            variant="primary"
          >
            <SignOutButton 
              redirectUrl="/"
            />
          </Button>
        </ClerkLoaded>
      </div>
    </div>
  )
}

export default Sidebar