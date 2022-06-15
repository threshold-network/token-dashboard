import { FC } from "react"
import { Icon, Stack } from "@chakra-ui/react"
import { Label3 } from "../../../../components/Typography"
import { tBTCFill } from "../../../../static/icons/tBTCFill"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingType } from "../../../../types/tbtc"

export const TbtcMintingCardTitle: FC = () => {
  const { mintingType } = useTbtcState()
  return (
    <Stack direction="row">
      <Icon boxSize="25px" as={tBTCFill} />
      <Label3 textTransform="uppercase">
        {mintingType === TbtcMintingType.mint && "TBTC - Minting Process"}
        {mintingType === TbtcMintingType.unmint && "TBTC - Unminting Process"}
      </Label3>
    </Stack>
  )
}
