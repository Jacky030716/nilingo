import { Edit, required, SimpleForm, TextInput } from "react-admin";

import React from 'react'

const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" label="Id" validate={[required()]}/>
        <TextInput source="title" label="Title" validate={[required()]}/>
        <TextInput source="src" label="Image" validate={[required()]}/>
      </SimpleForm>
    </Edit>
  )
}

export default CourseEdit