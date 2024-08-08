import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  src: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({many}) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: uuid("course_id").references(() => courses.id, {
    onDelete: 'cascade'
  }).notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({many, one}) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: uuid("lesson_id").primaryKey(),
  title: text("title").notNull(),
  unitId: uuid("unit_id").references(() => units.id, {
    onDelete: "cascade"
  }).notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelation = relations(lessons, ({many, one}) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey(),
  lessonId: uuid("lesson_id").references(() => lessons.id, {
    onDelete: "cascade"
  }).notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  questionAudioSrc: text("question_audio_src"),
  order: integer("order").notNull(),
});

export const challengesRelation = relations(challenges, ({many, one}) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: uuid("id").primaryKey(),
  challengeId: uuid("challenge_id").references(() => challenges.id, {
    onDelete: "cascade"
  }).notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelation = relations(challengeOptions, ({one}) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeProgress = pgTable("challenge_progress", {
  id: uuid("id").primaryKey(),
  userId: text("user_id"),
  challengeId: uuid("challenge_id").references(() => challenges.id, {
    onDelete: "cascade"
  }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelation = relations(challengeProgress, ({one}) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/assets/parrot.png"),
  activeCourseId: uuid("active_course_id").references(() => courses.id, {
    onDelete: "cascade"
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one, many }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
  userSettings: one(userSettings, {
    fields: [userProgress.userId],
    references: [userSettings.userId],
  }),
  userQuestsProgress: many(userQuestsProgress),
}));

export const userSubscription = pgTable("user_subscription", {
  id: uuid("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// 用户设置
export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  language: integer("language").notNull().default(0),
});

// 任务系统
export const questsEnum = pgEnum("type", ["DAILY", "COMMON", "EPIC"]);

export const quests = pgTable("quests", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  category: questsEnum("category").notNull(),
  completed: boolean("completed").notNull().default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
})

export const questRelations = relations(quests, ({ many }) => ({
  userQuestsProgress: many(userQuestsProgress),
}))

export const userQuestsProgress = pgTable("user_quests_progress", {
  id: uuid("id").primaryKey(),
  userId: text("user_id").references(() => userProgress.userId, {
    onDelete: "cascade"
  }).notNull(),
  questId: uuid("quest_id").references(() => quests.id, {
    onDelete: "cascade"
  }).notNull(),
  status: boolean("status").notNull().default(false),
  progress: integer("progress").notNull().default(0),
})

export const userQuestsProgressRelations = relations(userQuestsProgress, ({ one }) => ({
  quest: one(quests, {
    fields: [userQuestsProgress.questId],
    references: [quests.id],
  }),
  userProgress: one(userProgress, {
    fields: [userQuestsProgress.userId],
    references: [userProgress.userId],
  }),
}))