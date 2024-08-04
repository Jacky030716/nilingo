"use client"

import { usePracticeModal } from "@/store/use_practice_modal"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"

const PracticeModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, closeModal } = usePracticeModal()
  
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
              src="/assets/heart.svg"
              alt="Heart"
              height={100}
              width={100}
            />
          </div>
          <DialogTitle>
            <h2 className="text-2xl font-bold text-center">
              Practice Lesson
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-base">
             Use practice lessons to regain hearts and points. You will not lose hearts or points in practice lessons
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
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PracticeModal