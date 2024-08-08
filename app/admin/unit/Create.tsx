import { Create, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

import React from 'react'

const UnitCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="title" 
          label="Title" 
          validate={[required()]}
        />
        <TextInput 
          source="description" 
          label="Description" 
          validate={[required()]}
        />
        <ReferenceInput 
          source="courseId"
          reference="courses"
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

export default UnitCreate