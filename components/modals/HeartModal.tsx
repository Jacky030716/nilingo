"use client"

import { useHeartModal } from "@/store/use_heart_modal"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"

const HeartModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, closeModal } = useHeartModal()
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if(!isClient) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-md"
      >
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image 
              src="/assets/zebra.png"
              alt="Parrot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle>
            <h2 className="text-2xl font-bold text-center">
              You ran out of hearts!
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Buy some hearts or wait for them to recharge.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={() => {
                closeModal()
                router.push('/store')
              }}
            >
              Get Unlimited Hearts
            </Button>
            <Button
              variant="primaryOutline"
              className="w-full"
              size="lg"
              onClick={closeModal}
            >
              No thanks, I'll wait
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HeartModal