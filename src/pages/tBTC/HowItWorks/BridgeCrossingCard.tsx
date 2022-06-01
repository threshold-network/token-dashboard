import { FC, ComponentProps } from "react"
import { Stack } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import BoxLabel from "../../../components/BoxLabel"

export const BridgeCrossingCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card gridArea="bridge-crossing">
      <Label3>Bridge Crossing</Label3>
      <Stack spacing={5}>
        <BoxLabel w="fit-content">Sweeping</BoxLabel>
        <Body2>
          Sweeping action is the bridge crossing done every 8 hours. It’s the
          same duration for both directions.
        </Body2>
        <Body2>
          The sweeping is done every 8 hours in order to preserve a lower bridge
          fee. SPV proofs to confirm Bitcoin transactions are expensive.
        </Body2>
        <Body2>
          The accumulated deposits and redemptions’ SPV proof costs will be
          split evenly.
        </Body2>
      </Stack>
    </Card>
  )
}
