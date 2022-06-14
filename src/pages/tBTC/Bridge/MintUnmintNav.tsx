import { ComponentProps, FC } from "react"
import Card from "../../../components/Card"
import { Button, HStack } from "@chakra-ui/react"
import { TbtcMintAction } from "../../../types/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"

export const MintUnmintNav: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const { mintAction, setMintAction } = useTbtcState()
  return (
    <Card {...props}>
      <HStack>
        <Button
          variant={mintAction === TbtcMintAction.mint ? "solid" : "ghost"}
          onClick={() => setMintAction(TbtcMintAction.mint)}
        >
          Mint
        </Button>
        <Button
          variant={mintAction === TbtcMintAction.unmint ? "solid" : "ghost"}
          onClick={() => setMintAction(TbtcMintAction.unmint)}
        >
          Unmint
        </Button>
      </HStack>
    </Card>
  )
}
