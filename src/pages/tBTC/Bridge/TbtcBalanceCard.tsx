import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Label2, Body3, H5 } from "../../../components/Typography"
import { HStack } from "@chakra-ui/react"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label2 mb="5">tBTC Balance</Label2>
      <HStack alignItems={"baseline"}>
        <H5>0.00</H5>
        <Body3>tBTC</Body3>
      </HStack>
      <Body3>$0 USD</Body3>
    </Card>
  )
}
