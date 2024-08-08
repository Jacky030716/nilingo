// components/Card.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useKey } from "react-use";
import SettingModal from "@/components/modals/SettingModal";
import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";

type Props = {
  id: string;
  text: string;
  imageSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "incorrect" | "none";
  disabled?: boolean;
  type: typeof challenges.$inferSelect["type"];
  languageIndex?: number;
  initialSettings: {
    speed: number;
    volume: number;
  };
  setInitialSettings: (settings: { speed: number; volume: number }) => void;
  useDebounce: (func: (...args: any[]) => void, wait: number) => (...args: any[]) => void;
}

const Card = ({
  id,
  text,
  imageSrc,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
  languageIndex,
  initialSettings,
  setInitialSettings,
  useDebounce
}: Props) => {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    u.volume = initialSettings.volume
    u.rate = initialSettings.speed;
    
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text, initialSettings.speed, initialSettings.volume]);

  const handleClick = useCallback(
    useDebounce(() => {
      if (disabled) return;

      const synth = window.speechSynthesis;

      if (!utterance) return;

      utterance.voice = synth.getVoices()[languageIndex || 0];
      synth.cancel();
      synth.speak(utterance);

      onClick();
    }, 50),
    [disabled, onClick, utterance, languageIndex, text]
  );

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <>
      <SettingModal
        initialSettings={initialSettings}
        setInitialSettings={setInitialSettings}
      />
      <div
        onClick={handleClick}
        className={cn(
          "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
          selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
          selected && status === "correct" && "border-emerald-300 bg-emerald-100 hover:bg-emerald-100",
          selected && status === "incorrect" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
          disabled && "pointer-events-none hover:bg-white",
          type === "ASSIST" && "lg:p-3 w-full"
        )}
      >
        {type === "SELECT" && imageSrc && (
          <div
            className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full flex justify-center items-center"
          >
            <CldImage
              src={imageSrc}
              alt={text}
              width={160}
              height={160}
            />
          </div>
        )}
        <div className={cn(
          "flex items-center justify-between",
          type === "ASSIST" && "flex-row-reverse",
        )}>
          {type === "ASSIST" && <div />}
          <p className={cn(
            "text-neutral-600 text-lg lg:text-xl",
            selected && "text-sky-500",
            selected && status === "correct" && "text-emerald-500",
            selected && status === "incorrect" && "text-rose-500",
          )}>
            {text.toUpperCase()}
          </p>
          <div className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
            selected && "border-sky-300 text-sky-500",
            selected && status === "correct" && "border-emerald-300 text-emerald-500",
            selected && status === "incorrect" && "border-rose-300 text-rose-500",
          )}>
            {shortcut}
          </div>
        </div>
      </div>
    </>
  )
}

export default Card;
