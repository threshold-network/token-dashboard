import { FC } from "react"
import { Box, Button } from "@chakra-ui/react"
import { useTbtcState } from "../../../../hooks/useTbtcState"

export const MakeDeposit: FC = () => {
  const { advanceMintingStep, rewindMintingStep } = useTbtcState()

  return (
    <Box>
      Make Deposit
      <Button onClick={advanceMintingStep}>forward</Button>
      <Button onClick={rewindMintingStep}>back</Button>
    </Box>
  )
}
