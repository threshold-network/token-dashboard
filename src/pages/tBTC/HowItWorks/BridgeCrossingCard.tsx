import { FC, ComponentProps } from "react"
import { Stack } from "@chakra-ui/react"
import { Card, BodyMd, LabelSm, BoxLabel } from "@threshold-network/components"

export const BridgeCrossingCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card gridArea="bridge-crossing">
      <LabelSm mb={5}>Bridge Crossing</LabelSm>
      <Stack spacing={5}>
        <BoxLabel w="fit-content">Sweeping</BoxLabel>
        <BodyMd>
          Sweeping action is the bridge crossing done every 8 hours. It’s the
          same duration for both directions.
        </BodyMd>
        <BodyMd>
          The sweeping is done every 8 hours in order to preserve a lower bridge
          fee. SPV proofs to confirm Bitcoin transactions are expensive.
        </BodyMd>
        <BodyMd>
          The accumulated deposits and redemptions’ SPV proof costs will be
          split evenly.
        </BodyMd>
      </Stack>
    </Card>
  )
}
