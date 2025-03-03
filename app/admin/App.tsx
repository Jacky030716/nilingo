"use client"

import { Admin, Resource } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"

import { CourseList, CourseCreate, CourseEdit, UnitList, UnitCreate, UnitEdit, LessonList, LessonCreate, LessonEdit, ChallengeList, ChallengeCreate, ChallengeEdit, ChallengeOptionList, ChallengeOptionCreate, ChallengeOptionEdit, QuestList, QuestCreate, QuestEdit, GlossaryList, GlossaryCreate, GlossaryEdit } from "./index"

const dataProvider = simpleRestProvider("/api")

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource 
        name="courses"
        recordRepresentation="title"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
      />
      <Resource 
        name="units"
        recordRepresentation="title"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
      />
      <Resource 
        name="lessons"
        recordRepresentation="title"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
      />
      <Resource 
        name="glossary"
        recordRepresentation="text"
        list={GlossaryList}
        create={GlossaryCreate}
        edit={GlossaryEdit}
      />
      <Resource 
        name="challenges"
        recordRepresentation="question"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
      />
      <Resource 
        name="challengeOptions"
        recordRepresentation="text"
        list={ChallengeOptionList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        options={{ label: "Challenge Options"}}
      />
      <Resource 
        name="quests"
        recordRepresentation="title"
        list={QuestList}
        create={QuestCreate}
        edit={QuestEdit}
      />
    </Admin>
  )
}

export default App