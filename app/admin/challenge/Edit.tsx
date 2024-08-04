import { NumberInput, ReferenceInput, required, SimpleForm, TextInput, SelectInput, Edit } from "react-admin";

import React from 'react'

const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput 
          source="question" 
          label="Question" 
          validate={[required()]}
        />
        <SelectInput 
          source="type" 
          choices={[
            {
              id: "SELECT",
              name: "SELECT"
            },
            {
              id: "ASSIST",
              name: "ASSIST"
            }
          ]}
        />
        <ReferenceInput 
          source="lessonId"
          reference="lessons"
        />
        <NumberInput 
          source="order"
          validate={[required()]}
          label="Order"
        />
      </SimpleForm>
    </Edit>
  )
}

export default ChallengeEdit