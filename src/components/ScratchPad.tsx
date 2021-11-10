import { Stack, HStack } from "@chakra-ui/react"
import UpgradeCard from "./UpgradeCard"
import { Token } from "../enums"
import TokenBalanceCard from "./TokenBalanceCard"

export const ScratchPad = ({}) => {
  return (
    <Stack spacing={4} mt={8} w="100%">
      <HStack w="100%">
        <UpgradeCard token={Token.Keep} />
        <TokenBalanceCard token={Token.Keep} />
      </HStack>
      <HStack w="100%">
        <UpgradeCard token={Token.Nu} />
        <TokenBalanceCard token={Token.Nu} />
      </HStack>
    </Stack>
  )
}
