import { FC } from "react"
import { List } from "@chakra-ui/react"
import ChecklistItem, { ChecklistItemProps } from "../ChecklistItem"
import BoxLabel from "../BoxLabel"

interface ChecklistGroupProps {
  checklistItems: ChecklistItemProps[]
  title?: string
}

const ChecklistGroup: FC<ChecklistGroupProps> = ({ checklistItems, title }) => {
  return (
    <>
      {title && (
        <BoxLabel w="fit-content" mb={4}>
          {title}
        </BoxLabel>
      )}
      <List spacing={4}>
        {checklistItems.map((item, i) => (
          <ChecklistItem {...item} key={i} />
        ))}
      </List>
    </>
  )
}

export default ChecklistGroup
