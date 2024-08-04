import { Create, NumberInput, ReferenceInput, required, SimpleForm, TextInput, SelectInput, BooleanInput } from "react-admin";

import React from 'react'

const ChallengeOptionCreate = () => {
  return (
    <Create>
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
    </Create>
  )
}

export default ChallengeOptionCreate