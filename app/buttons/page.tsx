"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { index } from 'drizzle-orm/mysql-core';

export default function TestingPage() {
  const exampleWords = ['Yes', "I'm", 'from', 'Japan', 'me', 'do', 'Tokyo', 'Brazil'];

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(exampleWords);

  const handleWordClick = (word: string) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word))
  };

  const handleDeleteWord = (word: string, index: number) => {
    const newWords = [...selectedWords];
    newWords.splice(index, 1);
    setSelectedWords(newWords);
    setAvailableWords([...availableWords, word]);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <ProgressBar progress={75} />
        <h1 className="text-2xl font-bold mb-4">Write this in English</h1>
        <CharacterBubble text="はい、日本しゅっしんです。" />
        <div className="mt-4 space-y-2">
          <AnswerArea 
            words={selectedWords} 
            onDeleteWord={handleDeleteWord}
          />
          <WordOptions 
            words={availableWords}
            onWordClick={handleWordClick}
          />
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

interface CharacterBubbleProps {
  text: string;
}

function CharacterBubble({ text }: CharacterBubbleProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-blue-500 rounded-full mr-2"></div>
      <div className="bg-gray-800 rounded-lg p-3">
        <p>{text}</p>
      </div>
    </div>
  );
}

interface AnswerAreaProps {
  words: string[];
  onDeleteWord: (word:string, index: number) => void;
}

function AnswerArea({ words, onDeleteWord }: AnswerAreaProps) {
  return (
    <div className="bg-gray-800 p-3 rounded-lg min-h-[50px] max-h-fit flex flex-wrap gap-1">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onDeleteWord(word, index)}
          className="bg-transparent border-2 border-gray-700 border-b-4 px-2 py-1 rounded cursor-pointer"
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
          className="bg-gray-700 px-3 py-1 rounded"
          onClick={() => onWordClick(word)}
        >
          {word}
        </motion.button>
      ))}
    </div>
  );
}