import { challengeOptions, challenges } from "@/db/schema";
import Image from "next/image";
import { Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getImage } from "@/lib/utils";
import useDebounce from "@/lib/useDebounce";

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

  const correctImg = options.find((option) => option.correct)?.imageSrc

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
      <div className="flex items-center gap-x-4 mb-6">
        <Image 
          src="/assets/parrot.png"
          alt="Parrot"
          width={60}
          height={60}
          className="hidden lg:block"
        /> 
        <Image 
          src="/assets/parrot.png"
          alt="Parrot"
          width={40}
          height={40}
          className="lg:hidden block"
        /> 
        <div 
          className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-base"
        >
          {challenge.question.toUpperCase()}
          <div 
            className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90"
          />
        </div>
      </div>
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