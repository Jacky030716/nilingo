import { ReferenceInput, required, SimpleForm, TextInput, SelectInput, BooleanInput, Edit } from "react-admin";

import React from 'react'

const ChallengeOptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput 
          source="text" 
          label="Text" 
          validate={[required()]}
        />
        <BooleanInput 
          source="correct"
          label="Correct"
        />
        <ReferenceInput 
          source="challengeId"
          reference="challenges"
        />
        <TextInput 
          source="imageSrc"
          label="Image Url"
        />
        <TextInput 
          source="audioSrc"
          label="Audio Url"
        />
      </SimpleForm>
    </Edit>
  )
}

export default ChallengeOptionEdit