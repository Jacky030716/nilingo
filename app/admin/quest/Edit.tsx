import { BooleanInput, DateInput, Edit, minValue, NumberInput, required, SelectInput, SimpleForm, TextInput } from "react-admin";

const QuestEdit = () => {
  return (
    <Edit>
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
        <DateInput 
          source="startDate" 
          validate={
            [
              required(),
              minValue(new Date(), "Start date must be in the future")
            ]
          }
        />
        <DateInput 
          source="endDate" 
        />
      </SimpleForm>
    </Edit>
  )
}

export default QuestEdit