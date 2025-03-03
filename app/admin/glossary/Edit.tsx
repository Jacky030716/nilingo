import { Edit, ReferenceInput, SimpleForm, TextInput } from "react-admin";

const GlossaryEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="word" /> 
        <ReferenceInput source="lessonId" reference="lessons" />
      </SimpleForm>
    </Edit>
  )
}

export default GlossaryEdit