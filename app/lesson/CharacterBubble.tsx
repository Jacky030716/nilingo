import useDebounce from "@/lib/useDebounce";
import { Speaker, Volume, Volume1, Volume2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

type Props = {
  question: string;
  languageIndex?: number;
  initialSettings: {
    speed: number;
    volume: number;
  };
};

const CharacterBubble = ({ question, languageIndex = 0, initialSettings }: Props) => {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState(<Volume2 />);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(question);

    u.volume = initialSettings.volume;
    u.rate = initialSettings.speed;
    setUtterance(u);

    return () => synth.cancel();
  }, [initialSettings, question]);

  useEffect(() => {
    if (isPlaying) {
      const icons = [<Volume key="vol1" />, <Volume1 key="vol2" />, <Volume2 key="vol3" />];
      let index = 0;
      const interval = setInterval(() => {
        setVolumeIcon(icons[index]);
        index = (index + 1) % icons.length;
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleClick = useDebounce(() => {
    if (utterance) {
      const synth = window.speechSynthesis;
      utterance.voice = synth.getVoices()[languageIndex];
      synth.cancel();
      synth.speak(utterance);

      setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setVolumeIcon(<Volume2 />);
      };
    }
  }, 50);

  return (
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
      <div className="relative py-2 px-4 border-2 rounded-xl text-sm lg:text-xl">
        <div className="flex cursor-pointer" onClick={handleClick}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mr-2 text-sky-500">
              {volumeIcon}
            </div>
          </motion.div>
          {question.toUpperCase()}
        </div>
        <div className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90" />
      </div>
    </div>
  );
};

export default CharacterBubble;
