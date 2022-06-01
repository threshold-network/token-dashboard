import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import ChecklistGroup from "../../../components/ChecklistGroup"
import ExternalLink from "../../../components/ExternalLink"
import { ExternalHref } from "../../../enums"

export const DepositAddressCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label3>Bitcoin Deposit Address</Label3>
      <ChecklistGroup
        title="ETH address"
        checklistItems={[
          {
            title: (
              <Body2>
                As a user you need to provide an ETH address where your tBTC
                (ERC20) will be sent after minting inititation.
              </Body2>
            ),
          },
        ]}
      />
      <ChecklistGroup
        title="Recovery BTC address"
        checklistItems={[
          {
            title: (
              <Body2>
                You are required to provide a BTC address where the protocol
                will sent your BTC assets automatically after 30 days if
                anything wrong happens.
              </Body2>
            ),
          },
        ]}
      />
      <Body2 mt="5" mb="5">
        Based on these two addresses the protocol will create using a P2SWH a
        unique BTC deposit address for each user.{" "}
        <ExternalLink text="Read more" href={ExternalHref.nuDapp} withArrow />
      </Body2>
    </Card>
  )
}
