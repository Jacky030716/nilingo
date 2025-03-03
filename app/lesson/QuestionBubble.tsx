import { challengeOptions, challenges } from "@/db/schema";
import Image from "next/image";
import { Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getImage } from "@/lib/utils";
import useDebounce from "@/lib/useDebounce";
import CharacterBubble from "./CharacterBubble";

type Props = {
  challenge: typeof challenges.$inferSelect;
  options: (typeof challengeOptions.$inferSelect)[];
  languageIndex?: number;
  initialSettings: {
    speed: number;
    volume: number;
  }
  setInitialSettings: (settings: { speed: number; volume: number }) => void;
}

const QuestionBubble = ({
  challenge,
  options,
  languageIndex,
  initialSettings,
  setInitialSettings
}: Props) => {
  const [questionImage, setQuestionImage] = useState<string | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const correctImg = options.find((option) => option.correct)?.text

  const fetchQuestionImage = async () => {
    const data = await getImage(correctImg || "")
    const randomIndex = Math.floor(Math.random() * 10)
    setQuestionImage(data.hits[randomIndex].webformatURL)
  }

  useEffect(() => {
    fetchQuestionImage()
  }, [challenge.question, correctImg])

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(challenge.question);

    u.volume = initialSettings.volume
    u.rate = initialSettings.speed;
    
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [challenge, initialSettings]);

  const handleClick = useCallback(
    useDebounce(() => {
      if (utterance) {
        const synth = window.speechSynthesis;
        utterance.voice = synth.getVoices()[languageIndex || 0];
        synth.cancel();
        synth.speak(utterance);
      }
    }, 50),
    [utterance, languageIndex]
  );

  return (
    <div className="flex flex-col items-center">
      <CharacterBubble 
        question={challenge.question}
        initialSettings={initialSettings}
      />
      <div 
        className="mb-8 relative cursor-pointer"
        onClick={handleClick}
      >
        <Image 
          src={questionImage || ""} 
          alt="Question Image"
          width={150}
          height={100}
          className="rounded-md"
          style={{ width: '250px', height: '250px', objectFit: 'contain', objectPosition: 'center' }}
        />
        <Play 
          size={32}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </div>
    </div>
  )
}

export default QuestionBubble