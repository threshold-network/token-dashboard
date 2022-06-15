import { FC } from "react"
import { Box } from "@chakra-ui/react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"

export const MakeDeposit: FC = () => {
  const {} = useTbtcState()
  return (
    <Box>
      <TbtcMintingCardTitle />
    </Box>
  )
}
