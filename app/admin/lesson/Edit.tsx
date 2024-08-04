import {Edit, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

const LessonEdit = () => {
  return (
    <Edit>
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
    </Edit>
  )
}

export default LessonEdit