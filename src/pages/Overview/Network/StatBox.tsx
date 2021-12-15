import { FC } from "react"
import { Box, useChakra, useColorModeValue } from "@chakra-ui/react"
import { Body2, Body3, H2, H3 } from "../../../components/Typography"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"

const StatBox: FC<{ value: number | string; text: string }> = ({
  value,
  text,
}) => {
  const isMobile = useChakraBreakpoint("md")
  return (
    <Box
      background={useColorModeValue("gray.50", "gray.700")}
      padding={{ base: 3, md: 6 }}
      borderRadius="md"
      h="100%"
      w="100%"
    >
      {isMobile ? <Body2>{value}</Body2> : <H2 textAlign="center">{value}</H2>}
      {isMobile ? (
        <Body3 textAlign="center">{value}</Body3>
      ) : (
        <Body2 textAlign="center">{text}</Body2>
      )}
    </Box>
  )
}

export default StatBox
