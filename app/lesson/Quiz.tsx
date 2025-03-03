"use client"

import { challengeOptions, challenges, glossary, userSettings, userSubscription } from "@/db/schema";
import { useState, useTransition } from "react";
import Confetti from "react-confetti";
import Header from "./Header";
import QuestionBubble from "./QuestionBubble";
import Challenge from "./Challenge";
import Footer from "./Footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useMount, useWindowSize } from "react-use";
import Image from "next/image";
import ResultCard from "./ResultCard";
import { useRouter } from "next/navigation";
import { useHeartModal } from "@/store/use_heart_modal";
import { usePracticeModal } from "@/store/use_practice_modal";
import SpeakBubble from "./SpeakBubble";
import SentenceMatcher from "./SentenceMatcher";
import { useSettingModal } from "@/store/use_setting_modal";
import SettingModal from "@/components/modals/SettingModal";
import { shuffleArray } from "@/lib/utils";

type Props = {
  initialPercentage: number;
  initialLessonId: string;
  initialHearts: number;
  glossary: (typeof glossary.$inferSelect)[];
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean;
  } | null;
  languageIndex?: number;
}

const Quiz = ({
  initialPercentage,
  initialLessonId,
  initialHearts,
  initialLessonChallenges,
  userSubscription,
  languageIndex,
  glossary
}: Props) => {
  const { openModal: openHeartModal } = useHeartModal()
  const { openModal: openPracticeModal } = usePracticeModal()
  const { openModal: openSettingModal } = useSettingModal()

  const [initialSettings, setInitialSettings] = useState({
    speed: 1,
    volume: 1
  })

  // Correct Sound
  const [
    correctAudio,
    _c,
    correctControls
  ] = useAudio({
    src: "/assets/correct.mp3"
  })

  // Incorrect Sound
  const [
    incorrectAudio,
    _i,
    incorrectControls
  ] = useAudio({
    src: "/assets/false.mp3"
  })

  const [
    finishAudio,
  ] = useAudio({
    src: "/assets/finish.mp3",
    autoPlay: true
  })
  
  useMount(() => {
    if(initialPercentage === 100){
      openPracticeModal()
    }
  })
  // Pending Transition
  const [pending, startTransition] = useTransition()
  const { width, height } = useWindowSize()
  const router = useRouter()

  const [lessonId] = useState(initialLessonId) 
  const [heart, setHeart] = useState(initialHearts)
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })
  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const [selectedOption, setSelectedOption] = useState<string>()
  const [status, setStatus] = useState<"correct" | "incorrect" | "none">("none")

  const onSelect = (id: string) => {
    if(status !== "none") return;

    setSelectedOption(id)
  }

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []

  const distractors = shuffleArray(glossary.map((item) => item.word).filter((word) => !options.find((option) => option.text.includes(word))).slice(0, 6))

  const checkAnswer = (correctOption: string) => {
    if(!selectedOption) return;

    const correctAns = correctOption.replaceAll(" ", "").toLowerCase()

    if(correctAns === selectedOption)
      return true;

    return false;
  }

  const onNext = () => {
    setActiveIndex((prev) => prev + 1)
  }

  const onContinue = () => {
    if(!selectedOption) return;

    if(status === 'incorrect'){
      setStatus("none")
      setSelectedOption(undefined)
      return;
    }

    if(status === 'correct'){
      onNext()
      setStatus("none")
      setSelectedOption(undefined)
      return;
    }

    const correctOption = options.find((option) => option.correct)

    if(!correctOption) return;

    if(correctOption.id === selectedOption || checkAnswer(correctOption.text)){
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((res) => {
            if(res?.error === "hearts"){
              openHeartModal()
              return;
            }

            correctControls.play();
            setStatus("correct")
            setPercentage((prev) => prev + 100 / challenges.length)

            // Practice Mode
            if(initialPercentage === 100){
              setHeart((prev) => Math.min(prev + 1, 5))
            }
          })
          .catch(() => {
            toast.error("Please try again")
          })
      })
    }else{
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((res) => {
            if(res?.error === "hearts"){
              openHeartModal();
              return;
            }
            incorrectControls.play();
            setStatus("incorrect")

            if(!res?.error){
              incorrectControls.play();
              setHeart((prev) => Math.max(prev - 1, 0))
            }
          })
          .catch(() => {
            toast.error("Please try again")
          })
      })
    }
  }

  if(!challenge){
    return (
      <>
        {finishAudio}
        <Confetti 
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-xl mx-auto text-center items-center justify-center h-full">
          <Image 
            src={'/assets/finish.svg'}
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image 
            src={'/assets/finish.svg'}
            alt="Finish"
            className="lg:hidden block"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job!<br /> You have completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard 
              variant="points"
              value={challenges.length * 10}
            />
            <ResultCard 
              variant="hearts"
              value={heart}
            />
          </div>
        </div>
        <Footer 
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    )
  }

  const title = challenge.type === "ASSIST" 
    ? "Select the correct answer"
    : challenge.type === "SENTENCE"
      ? "Match the words to form the sentence"
    : challenge.question

  return (
    <div className="flex flex-col gap-y-6 overflow-y-hidden">
      {correctAudio}
      {incorrectAudio}
      <SettingModal
        initialSettings={initialSettings}
        setInitialSettings={setInitialSettings}
      />
      <Header
        hearts={heart}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
        onSettings={openSettingModal}
      />
      <div className="flex w-full items-center justify-center">
        <div className="h-full flex justify-center items-center">
          <div className="lg:min-h-[370px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col justify-center gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble 
                  challenge={challenge}
                  options={options}
                  languageIndex={languageIndex}
                  initialSettings={initialSettings}
                  setInitialSettings={setInitialSettings}
                />
              )}
              {challenge.type === "SENTENCE" && (
                <SentenceMatcher
                  challenge={challenge}
                  distractors={distractors}
                  options={options}
                  languageIndex={languageIndex}
                  initialSettings={initialSettings}
                  status={status}
                  onSelect={onSelect}
                />
              )}
              {challenge.type !== "SENTENCE" && (
                <Challenge 
                  options={options}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                  type={challenge.type}
                  languageIndex={languageIndex}
                  initialSettings={initialSettings}
                  setInitialSettings={setInitialSettings}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer 
        disabled={pending}
        status={status}
        onCheck={onContinue}
      />
    </div>
  )
}

export default Quiz