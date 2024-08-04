import { Create, NumberInput, ReferenceInput, required, SimpleForm, TextInput, SelectInput } from "react-admin";

import React from 'react'

const ChallengeCreate = () => {
  return (
    <Create>
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
    </Create>
  )
}

export default ChallengeCreate