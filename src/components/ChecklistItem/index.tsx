import { FC } from "react"
import {
  Box,
  Stack,
  ListIcon,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsCheckCircleFill } from "react-icons/all"
import { Body2, Body3 } from "../Typography"

interface ChecklistItemProps {
  title: string | JSX.Element
  subTitle?: string | JSX.Element
}

const ChecklistItem: FC<ChecklistItemProps> = ({ title, subTitle }) => {
  return (
    <ListItem>
      <Stack direction="row">
        <ListIcon
          mt="2px"
          height="22px"
          width="22px"
          as={BsCheckCircleFill}
          color="green.500"
        />
        <Box>
          {typeof title === "string" ? (
            <Body2 color={useColorModeValue("gray.700", "white")}>
              {title}
            </Body2>
          ) : (
            title
          )}
          {typeof subTitle === "string" ? (
            <Body3 color="gray.500">{subTitle}</Body3>
          ) : (
            subTitle
          )}
        </Box>
      </Stack>
    </ListItem>
  )
}

export default ChecklistItem
