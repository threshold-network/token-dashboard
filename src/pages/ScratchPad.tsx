import { Stack } from "@chakra-ui/react"
import UpgradeCard from "../components/UpgradeCard"
import { Token } from "../enums"

export const ScratchPad = ({}) => {
  return (
    <Stack spacing={4} maxW="md" mt={8}>
      <UpgradeCard token={Token.Keep} />
      <UpgradeCard token={Token.Nu} />
    </Stack>
  )
}
