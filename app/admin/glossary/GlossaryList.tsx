import { Datagrid, List, NumberField, ReferenceField, TextField, } from "react-admin";

const GlossaryList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="word" /> 
        <ReferenceField source="lessonId" reference="lessons" />
      </Datagrid>
    </List>
  )
}

export default GlossaryList