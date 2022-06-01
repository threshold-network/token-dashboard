import { FC, ComponentProps } from "react"
import { Stack } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"

export const TbtcBridgeCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label3 mb={5} textTransform="none">
        tBTC BRIDGE
      </Label3>
      <Stack spacing={5}>
        <Body2>
          The second generation of tBTC is a truly decentralized bridge between
          Bitcoin and Ethereum.
        </Body2>
        <Body2>
          By providing Bitcoin holders permissionless access to DeFi and the
          expanding web3 universe.
        </Body2>
        <Body2>
          tBTC v2 is permissionless, making it open and accessible to all.
        </Body2>
      </Stack>
    </Card>
  )
}
