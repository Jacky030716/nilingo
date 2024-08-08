"use client"

import { Admin, Resource } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"

import CourseList from "./course/CourseList"
import CourseCreate from "./course/Create"
import CourseEdit from "./course/Edit"

import UnitList from "./unit/UnitList"
import UnitCreate from "./unit/Create"
import UnitEdit from "./unit/Edit"

import LessonList from "./lesson/LessonList"
import LessonCreate from "./lesson/Create"
import LessonEdit from "./lesson/Edit"

import ChallengeList from "./challenge/ChallengeList"
import ChallengeCreate from "./challenge/Create"
import ChallengeEdit from "./challenge/Edit"

import ChallengeOptionList from "./challengeOption/ChallengeOptionList"
import ChallengeOptionCreate from "./challengeOption/Create"
import ChallengeOptionEdit from "./challengeOption/Edit"

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
    </Admin>
  )
}

export default App