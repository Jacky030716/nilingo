"use client"

import { updateQuestProgress } from "@/actions/quest-progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { quests, userProgress } from "@/db/schema";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  userProgress: typeof userProgress.$inferSelect;
  quest: (typeof quests.$inferSelect);
  value: string;
  completed: boolean
}

const QuestItemBox = ({
  userProgress,
  quest,
  value,
  completed
}: Props) => {
    const [pending, startTransition] = useTransition()

    const progress = quest.targetPoints ? (userProgress.points / quest.targetPoints) * 100 : 0;
    let remainingDay;

    if (quest.endDate) {
      const endDate = new Date(quest.endDate);
      if (!isNaN(endDate.getTime())) {
        remainingDay = formatDistanceToNow(endDate, {
          addSuffix: true
        });
      }
    }

    const onClick = (id: string) => {
      if(pending) return
  
      startTransition(() => {
        updateQuestProgress(id)
          .then(() => toast.success("Quest completed"))
          .catch(() => toast.error("Something went wrong"))
      })
    }

    return (
      <div
        key={quest.id}
        className={cn('flex items-center w-full p-4 gap-x-4 border rounded-sm relative',
          completed && 'bg-emerald-100'
        )}
      >
        <Image 
          src="/assets/star.svg"
          alt='Star'
          width={40}
          height={40}
        />
        <div className='flex flex-col gap-y-2 w-full'>
          <div className='flex justify-between items-center'>
            <div className="flex flex-col">
              <p className='text-neutral-700 text-lg font-bold flex justify-between items-center'>
                {quest.title}
              </p>
              <p
                className="text-neutral-500 font-light text-sm"
              >
                {quest.description}
              </p>
            </div>

            {remainingDay && (
              <p className='text-md font-light text-neutral-500'>
                ends in {remainingDay}
              </p>
            )}

          </div>
          { quest.targetPoints &&
            userProgress.points >= quest.targetPoints ? (
            <Button
              size='sm'
              className='w-full'
              variant={pending ? 'ghost' : 'secondary'}
              onClick={() => onClick(quest.id)}
              disabled={pending || completed}
            >
              Collect Reward
            </Button>
          ) : (
            <Progress value={progress} className='h-2'/>
          )}
          { completed && (
            <div
              className="absolute right-2 top-2 border border-emerald-400 rounded-full p-1 flex justify-center items-center w-fit"
            >
              <Check 
                className="text-emerald-400"
              />
            </div>
          )}
        </div>
      </div>
    )
}

export default QuestItemBox;