"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingModal } from "@/store/use_setting_modal";
import { CheckCircle, Settings, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useKey, useMedia } from "react-use"

type Props = {
  disabled?: boolean;
  status: "correct" | "incorrect" | "none" | "completed";
  onCheck: () => void;
  lessonId?: string;
}

const Footer = ({
  disabled,
  status,
  onCheck,
  lessonId
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck])
  const isMobile = useMedia("(max-width: 1024px")
  const { openModal } = useSettingModal()

  const router = useRouter()

  return (
    <footer className={cn(
      "lg:h-[140px] h-[100px] border-t-2",
      status === "correct" && "border-transparent bg-emerald-100",
      status === "incorrect" && "border-transparent bg-rose-100",
    )}>
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        <Settings
          size={36} 
          className="text-neutral-500 cursor-pointer"
          onClick={openModal}
        />
        {status === "correct" && (
          <div className="text-emerald-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lh:h-10 lg:w-10 mr-4"/>
            Done!
          </div>
        )}
        {status === "incorrect" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <XCircle className="h-6 w-6 lh:h-10 lg:w-10 mr-4"/>
            Try again!
          </div>
        )}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => router.push(`lesson/${lessonId}`)}
          >
            Practice Again
          </Button>
        )}
        <Button
          disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm": "lg"}
          variant={status === "incorrect" ? "danger" : "secondary"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "incorrect" && "Retry"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  )
}

export default Footer