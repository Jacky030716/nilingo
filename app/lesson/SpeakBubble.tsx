import { challengeOptions, challenges } from "@/db/schema";
import Image from "next/image";
import { Mic, Play } from "lucide-react";
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

  const correctImg = challenge.question

  const fetchQuestionImage = async () => {
    const data = await getImage(correctImg || "")
    const randomIndex = Math.floor(Math.random() * 20)
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

  const question = challenge.question.toLowerCase()

  const handleOnRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    recognition.onresult = async (e) => {
      const userAns = e.results[0][0].transcript.toLowerCase();
  
      // Check if userAns has 90% match with question
      function findLongestConsecutiveMatch(str1: string, str2: string): number {
        let maxLength = 0;
        let currentLength = 0;
      
        // Loop through both strings
        for (let i = 0, j = 0; i < str1.length && j < str2.length;) {
          if (str1[i] === str2[j]) {
            // Increase the length of the current match
            currentLength++;
            maxLength = Math.max(maxLength, currentLength);
            i++;
            j++;
          } else {
            // If characters don't match, reset current length
            currentLength = 0;
            // Move only the index of the shorter string
            i++;
            j++;
          }
        }
      
        return maxLength;
      }
  
      const match = findLongestConsecutiveMatch(userAns, question);
      const matchPercentage = (match / question.length) * 100;
  
      if (matchPercentage >= 90) {
        console.log('Correct', matchPercentage);
      } else {
        console.log('Incorrect', userAns, question, matchPercentage);
      }
    };
    recognition.start();
  };

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
          style={{ width: '350px', height: '300px', objectFit: 'contain', objectPosition: 'center' }}
        />
        <Play 
          size={32}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div 
          className="rounded-full border p-2 cursor-pointer hover:bg-neutral-100/50"
          onClick={handleOnRecord}
        >
          <Mic size={24}/>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Tap to speak</p>
      </div>
    </div>
  )
}

export default QuestionBubble