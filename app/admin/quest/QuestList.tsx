import { BooleanField, Datagrid, DateField, List, NumberField, ReferenceField, SelectField, TextField } from "react-admin";

import React from 'react'

const QuestList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id"/>
        <TextField source="title" />
        <TextField source="description" />
        <NumberField source="targetPoints" />
        <NumberField source="rewardPoints" />
        <NumberField source="rewardExp" />
        <SelectField 
          source="category" 
          choices={[
            {
              id: "DAILY",
              name: "DAILY"
            },
            {
              id: "COMMON",
              name: "COMMON"
            },
            {
              id: "EPIC",
              name: "EPIC"
            }
          ]}
        />
        <SelectField 
          source="type" 
          choices={[
            {
              id: "POINTS",
              name: "POINTS"
            },
            {
              id: "UNIT",
              name: "UNIT"
            },
            {
              id: "CHALLENGE",
              name: "CHALLENGE"
            }
          ]}
        />
        <DateField source="startDate" showTime/>
        <DateField source="endDate" showTime/>
      </Datagrid>
    </List>
  )
}

export default QuestList