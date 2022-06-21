import { ComponentProps, FC } from "react"
import { Button, HStack } from "@chakra-ui/react"
import { Card } from "@threshold-network/components"
import { TbtcMintingType } from "../../../types/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"

export const MintUnmintNav: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const { mintingType, updateState } = useTbtcState()
  return (
    <Card {...props}>
      <HStack>
        <Button
          isFullWidth
          variant={mintingType === TbtcMintingType.mint ? "outline" : "ghost"}
          onClick={() => updateState("mintingType", TbtcMintingType.mint)}
        >
          Mint
        </Button>
        <Button
          isFullWidth
          variant={mintingType === TbtcMintingType.unmint ? "outline" : "ghost"}
          onClick={() => updateState("mintingType", TbtcMintingType.unmint)}
        >
          Unmint
        </Button>
      </HStack>
    </Card>
  )
}
