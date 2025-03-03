import { Create, ReferenceInput, SimpleForm, TextInput } from "react-admin";

const GlossaryCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="word" /> 
        <ReferenceInput source="lessonId" reference="lessons" />
      </SimpleForm>
    </Create>
  )
}

export default GlossaryCreate