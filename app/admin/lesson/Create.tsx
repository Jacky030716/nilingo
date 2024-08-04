import { Create, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

import React from 'react'

const LessonCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="title" 
          label="Title" 
          validate={[required()]}
        />
        <ReferenceInput 
          source="unitId"
          reference="units"
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

export default LessonCreate