import { FC, ComponentProps } from "react"
import { Stack } from "@chakra-ui/react"
import {
  BodyMd,
  LabelSm,
  Card,
  ChecklistGroup,
} from "@threshold-network/components"
import ExternalLink from "../../../components/ExternalLink"
import { ExternalHref } from "../../../enums"

export const DepositAddressCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Stack spacing={5}>
        <LabelSm>Bitcoin Deposit Address</LabelSm>
        <BodyMd>
          In order to deposit you need to provide protocol the following
          addresses:
        </BodyMd>
        <ChecklistGroup
          title="ETH address"
          checklistItems={[
            {
              itemId: "eth-address",
              itemTitle: (
                <BodyMd>
                  As a user you need to provide an ETH address where your tBTC
                  (ERC20) will be sent after minting inititation.
                </BodyMd>
              ),
            },
          ]}
        />
        <ChecklistGroup
          title="Recovery BTC address"
          checklistItems={[
            {
              itemId: "btc-recovery-address",
              itemTitle: (
                <BodyMd>
                  You are required to provide a BTC address where the protocol
                  will sent your BTC assets automatically after 30 days if
                  anything wrong happens.
                </BodyMd>
              ),
            },
          ]}
        />
        <BodyMd>
          Based on these two addresses the protocol will create using a P2SWH a
          unique BTC deposit address for each user.{" "}
          <ExternalLink
            isExternal
            text="Read more"
            href={ExternalHref.nuDapp}
          />
        </BodyMd>
      </Stack>
    </Card>
  )
}
