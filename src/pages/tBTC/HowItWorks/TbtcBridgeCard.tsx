import { FC, ComponentProps } from "react"
import { Stack } from "@chakra-ui/react"
import { Card, BodyMd, LabelSm } from "@threshold-network/components"

export const TbtcBridgeCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb={5} textTransform="none">
        tBTC BRIDGE
      </LabelSm>
      <Stack spacing={5}>
        <BodyMd>
          The second generation of tBTC is a truly decentralized bridge between
          Bitcoin and Ethereum.
        </BodyMd>
        <BodyMd>
          By providing Bitcoin holders permissionless access to DeFi and the
          expanding web3 universe.
        </BodyMd>
        <BodyMd>
          tBTC v2 is permissionless, making it open and accessible to all.
        </BodyMd>
      </Stack>
    </Card>
  )
}
