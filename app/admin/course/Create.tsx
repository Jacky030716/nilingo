import { Create, required, SimpleForm, TextField, TextInput } from "react-admin";

import React from 'react'

const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" label="Title" validate={[required()]}/>
        <TextInput source="src" label="Image" validate={[required()]}/>
      </SimpleForm>
    </Create>
  )
}

export default CourseCreate