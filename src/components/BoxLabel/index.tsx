import { FC } from "react"
import { TextProps, useColorModeValue } from "@chakra-ui/react"
import { Body3 } from "../Typography"

const BoxLabel: FC<TextProps> = (props) => (
  <Body3
    borderRadius="md"
    px={2}
    py={1}
    bg={useColorModeValue("gray.50", "gray.700")}
    {...props}
  >
    {props.children}
  </Body3>
)

export default BoxLabel
