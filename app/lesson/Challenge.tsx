import React, { useEffect } from 'react';
import { challengeOptions, challenges } from "@/db/schema"
import { cn } from "@/lib/utils";
import Card from "./Card";
import useDebounce from "@/lib/useDebounce";

type Props = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: string) => void;
  status: "correct" | "incorrect" | "none";
  selectedOption?: string;
  disabled?: boolean;
  type: typeof challenges.$inferSelect["type"]; 
  languageIndex?: number;
  initialSettings: {
    speed: number;
    volume: number;
  }
  setInitialSettings: (settings: { speed: number; volume: number }) => void;
}

const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  languageIndex,
  initialSettings,
  setInitialSettings
}: Props) => {
  return (
    <div className={cn(
      "grid gap-2",
      type === "ASSIST" && "grid-cols-1",
      type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
    )}>
      {options.map((option, i) => (
        <Card 
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          disabled={disabled}
          type={type}
          languageIndex={languageIndex}
          initialSettings={initialSettings}
          setInitialSettings={setInitialSettings}
          useDebounce={useDebounce}
        />
      ))}
    </div>
  )
}

export default Challenge;
