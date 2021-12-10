import { FC } from "react"
import { Box } from "@chakra-ui/react"
import { Body2, H2 } from "../../../components/Typography"

const StatBox: FC<{ value: number | string; text: string }> = ({
  value,
  text,
}) => {
  return (
    <Box background="gray.50" padding={6} borderRadius="md">
      <H2 textAlign="center">{value}</H2>
      <Body2 textAlign="center">{text}</Body2>
    </Box>
  )
}

export default StatBox
