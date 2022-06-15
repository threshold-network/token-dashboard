import { FC } from "react"
import { Box } from "@chakra-ui/react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"

export const InitiateMinting: FC = () => {
  const {} = useTbtcState()
  return (
    <Box>
      <TbtcMintingCardTitle />
    </Box>
  )
}
