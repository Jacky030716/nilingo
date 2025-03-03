import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use_exit_modal";
import { useSettingModal } from "@/store/use_setting_modal";
import { InfinityIcon, Settings, XIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
  onSettings: () => void;
}

const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
  onSettings
}: Props) => {
  const { openModal: openExitModal } = useExitModal()

  return (
    <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <XIcon 
        onClick={openExitModal}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />
      <Settings
        size={32} 
        className="text-neutral-500 cursor-pointer"
        onClick={onSettings}
      />
      <Progress 
        value={percentage}
      />
      <div className="text-rose-500 flex items-center font-semibold">
        <Image 
          src="/assets/heart.svg"
          width={28}
          height={28}
          alt="heart"
          className="mr-2"
        />
        {hasActiveSubscription ? <InfinityIcon className="h-6 w-6 stroke-[3] md:shrink-1"/> : hearts}
      </div>
    </header>
  )
}

export default Header