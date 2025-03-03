import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CharacterBubble from './CharacterBubble';
import { set } from 'date-fns';
import { cn } from '@/lib/utils';
import { challengeOptions, challenges, glossary } from '@/db/schema';
import useDebounce from '@/lib/useDebounce';

type SentenceMatcherProps = {
  onSelect: (option: string) => void;
  languageIndex?: number;
  initialSettings: {
    speed: number;
    volume: number;
  }
  status: "correct" | "incorrect" | "none";
  challenge: typeof challenges.$inferSelect;
  options: (typeof challengeOptions.$inferSelect)[];
  distractors:  string[];
}

const SentenceMatcher = ({
  onSelect,
  languageIndex,
  initialSettings,
  status,
  challenge,
  options,
  distractors
}: SentenceMatcherProps) => {
  const optionsWords = options.map((option) => option.text.split(' ')).flat();

  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const allAvailableWords = shuffleArray([...optionsWords, ...distractors]).flat();

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(allAvailableWords); 

  const handleWordClick = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    const synth = window.speechSynthesis;
    utterance.voice = synth.getVoices()[languageIndex || 0];
    synth.cancel();
    synth.speak(utterance);

    setSelectedWords((prevSelectedWords) => {
      const newSelectedWords = [...prevSelectedWords, word];
      onSelect(newSelectedWords.join('')); 
      return newSelectedWords;
    });
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  const handleDeleteWord = (word: string, index: number) => {
    setSelectedWords((prevSelectedWords) => {
      const newWords = [...prevSelectedWords];
      newWords.splice(index, 1);
      onSelect(newWords.join());
      return newWords;
    });
    setAvailableWords((prevAvailableWords) => [...prevAvailableWords, word]);
  };

  return (
    <div className="p-2">
      <div className="flex items-start justify-center flex-col min-w-[600px] mx-auto">
        <h1 className="text-2xl font-bold text-black mb-4">Write this in English</h1>
        <CharacterBubble 
          question={challenge.question} 
          languageIndex={languageIndex}
          initialSettings={initialSettings}
        />
        <div className="mt-4 space-y-6">
          <AnswerArea 
            words={selectedWords} 
            onDeleteWord={handleDeleteWord}
            status={status}
          />
          <WordOptions 
            words={availableWords}
            onWordClick={handleWordClick}
          />
        </div>
      </div>
    </div>
  )
}

interface AnswerAreaProps {
  words: string[];
  onDeleteWord: (word: string, index: number) => void;
  status: "correct" | "incorrect" | "none";
}

function AnswerArea({ words, onDeleteWord, status }: AnswerAreaProps) {
  return (
    <div className="bg-neutral-200/50 py-3 px-6 rounded-xl min-h-[70px] min-w-[600px] w-full shrink-0 flex flex-wrap gap-2">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onDeleteWord(word, index)}
          className={cn(
            "bg-transparent border border-b-4 border-neutral-500 px-4 py-2 rounded cursor-pointer font-semibold",
            status === "correct" && "border-emerald-500 text-emerald-500",
            status === "incorrect" && "border-rose-500 text-rose-500"
          )}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

interface WordOptionsProps {
  words: string[];
  onWordClick: (word: string) => void;
}

function WordOptions({ words, onWordClick }: WordOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent border border-b-4 border-neutral-300 px-6 py-2 rounded font-semibold text-neutral-500"
          onClick={() => onWordClick(word)}
        >
          {word}
        </motion.button>
      ))}
    </div>
  );
}

export default SentenceMatcher