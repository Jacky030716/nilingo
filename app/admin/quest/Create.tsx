import { BooleanInput, Create, DateInput, DateTimeInput, minValue, NumberInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";

const QuestCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="title" 
          validate={[required()]}
        />
        <TextInput 
          source="description" 
          validate={[required()]}
        />
        <NumberInput source="targetPoints" />
        <NumberInput source="rewardPoints" />
        <NumberInput source="rewardExp" />
        <SelectInput 
          source="category" 
          choices={[
            {
              id: "DAILY",
              name: "DAILY"
            },
            {
              id: "COMMON",
              name: "COMMON"
            },
            {
              id: "EPIC",
              name: "EPIC"
            }
          ]}
        />
        <SelectInput
          source="type" 
          choices={[
            {
              id: "POINTS",
              name: "POINTS"
            },
            {
              id: "UNIT",
              name: "UNIT"
            },
            {
              id: "CHALLENGE",
              name: "CHALLENGE"
            }
          ]}
        />
        <DateTimeInput 
          source="startDate"
          validate={[required(), minValue(new Date())]}
        />
        <DateTimeInput 
          source="endDate"
        />
      </SimpleForm>
    </Create>
  )
}

export default QuestCreate