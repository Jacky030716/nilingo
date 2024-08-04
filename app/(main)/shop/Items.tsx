"use client";

import { refillHeart } from "@/actions/user-progress";
import { createStripeURL } from "@/actions/user-sub";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
}

const POINTS_TO_REFILL = 20

const Items = ({
  hearts,
  points,
  hasActiveSubscription
}: Props) => {
  const [pending, startTransition] = useTransition()

  const onRefillHearts = () => {
    if(pending || hearts === 5 || points < POINTS_TO_REFILL) return

    startTransition(() => {
      refillHeart()
        .catch((err) => toast.error(err))
    })
  }

  const onUpgradeToPro = () => {
    startTransition(() => {
      createStripeURL()
        .then((res) => {
          if(res.data){
            window.location.href = res.data
          }
        })
        .catch(() => toast.error("Failed to create subscription"))
    })
  }

  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image 
          src="/assets/heart.svg"
          alt="Heart"
          height={64}
          width={64}
        />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Refill hearts
          </p>
        </div>
        <Button
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
          onClick={onRefillHearts}
          className={cn(
            hearts === 5 && 'bg-emerald-100 border-emerald-500 text-emerald-500'
          )}
        >
          {hearts === 5 
            ? 'Full' 
            : (
              <div className="flex items-center">
                <Image 
                  src="/assets/star.svg"
                  alt="Points"
                  height={20}
                  width={20}
                />
                <p>
                  {POINTS_TO_REFILL}
                </p>
              </div>
            )}
        </Button>
      </div>
      <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
        <Image 
          src="/assets/unlimited.svg"
          alt="Pro"
          height={64}
          width={64}
        />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Unlimited Heart
          </p>
        </div>
        <Button
          disabled={pending}
          onClick={onUpgradeToPro}
          className={cn(
            !hasActiveSubscription && 'bg-sky-100 border-sky-500 text-sky-500'
          )}
        >
          {hasActiveSubscription ? 'Settings' : 'Activate'}
        </Button>
      </div>
    </ul>
  )
}

export default Items