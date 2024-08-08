import { lessons, units } from "@/db/schema";
import UnitBanner from "./UnitBanner";
import LessonButton from "./LessonButton";

type Props = {
  id: string;
  order: number;
  title: string;
  desc: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
  activeLesson: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  } | undefined;
  activeLessonPercentage: number;
}

const Unit = ({
  id,
  order,
  title,
  desc,
  lessons,
  activeLesson,
  activeLessonPercentage
}: Props) => {
  return (
    <>
      <UnitBanner 
        title={title}
        desc={desc}
      />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, i) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
              <LessonButton 
                key={lesson.id}
                id={lesson.id}
                index={i}
                totalCount={lessons.length - 1}
                current={isCurrent}
                locked={isLocked}
                percentage={activeLessonPercentage}
              />
          )
        })}
      </div>
    </>
  )
}

export default Unit