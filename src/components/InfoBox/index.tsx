import { FC } from "react"
import { StackProps, Stack, useColorModeValue } from "@chakra-ui/react"
import { H3 } from "../Typography"
import { useModal } from "../../hooks/useModal"

const InfoBox: FC<{ text?: string } & StackProps> = ({ text, ...props }) => {
  const { isOpen: isModal } = useModal()

  return (
    <Stack
      bg={useColorModeValue("gray.50", isModal ? "gray.500" : "gray.700")}
      mt={4}
      px={6}
      py={2}
      borderRadius="md"
      mb={2}
      {...props}
    >
      {text && <H3>{text}</H3>}
      {props.children}
    </Stack>
  )
}

export default InfoBox
