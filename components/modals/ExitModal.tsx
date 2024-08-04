"use client"

import { useExitModal } from "@/store/use_exit_modal"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"

const ExitModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, closeModal } = useExitModal()
  
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
              src="/assets/parrot.png"
              alt="Parrot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle>
            <h2 className="text-2xl font-bold text-center">
              Are you sure want to exit?
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You&apos;'re about to leave the page. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={closeModal}
            >
              Continue Learning
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                closeModal(),
                router.push("/learn")
              }}
            >
              End Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExitModal