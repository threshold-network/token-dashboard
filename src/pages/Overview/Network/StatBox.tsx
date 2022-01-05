import { FC } from "react"
import { Box, useColorModeValue } from "@chakra-ui/react"
import { Body2, H2 } from "../../../components/Typography"

const StatBox: FC<{ value: number | string; text: string }> = ({
  value,
  text,
}) => {
  return (
    <Box
      background={useColorModeValue("gray.50", "gray.700")}
      padding={{ base: 3, md: 6 }}
      borderRadius="md"
      h="100%"
      w="100%"
    >
      <H2 textAlign="center">{value}</H2>
      <Body2 textAlign="center">{text}</Body2>
    </Box>
  )
}

export default StatBox
