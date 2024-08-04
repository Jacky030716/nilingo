import {Edit, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin";

const UnitEdit = () => {
  return (
    <Edit>
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
    </Edit>
  )
}

export default UnitEdit