import { FC } from "react"
import { Body3 } from "../Typography"
import { Icon, Link, List, useColorModeValue } from "@chakra-ui/react"
import { FiArrowUpRight } from "react-icons/all"
import ChecklistItem, { ChecklistItemProps } from "../ChecklistItem"

interface ChecklistGroupProps {
  checklistItems: ChecklistItemProps[]
  title?: string
}

const ChecklistGroup: FC<ChecklistGroupProps> = ({ checklistItems, title }) => {
  return (
    <>
      {title && (
        <Body3
          mb={2}
          w="fit-content"
          bg={useColorModeValue("gray.50", "gray.700")}
          px={2}
          py={1}
          borderRadius="md"
        >
          {title}
        </Body3>
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
