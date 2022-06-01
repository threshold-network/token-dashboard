import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import ChecklistGroup from "../../../components/ChecklistGroup"
import ExternalLink from "../../../components/ExternalLink"
import { ExternalHref } from "../../../enums"

export const DecentralizedSolution: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label3 mb="5">A Decentralized Solution</Label3>
      <Body2 mb="5">
        tBTC v2 replaces centralized intermediaries with a randomly selected
        group of operators running nodes on the Threshold Network.
      </Body2>
      <ChecklistGroup
        title="How this works"
        checklistItems={[
          {
            title: (
              <Body2>
                The group of independent operators works together to secure your
                deposited Bitcoin through{" "}
                <ExternalLink
                  text="threshold cryptography"
                  href="NEED_URL"
                  withArrow
                />
              </Body2>
            ),
          },
          {
            title: (
              <Body2>
                tBTC v2 requires a threshold majority(51/100) of these operators
                to agree to access or perform any action with your Bitcoin.
              </Body2>
            ),
          },
          {
            title: (
              <Body2>
                By rotating the selection of operators weekly, tBTC v2 protects
                against any individual or group of operators seizing control.
              </Body2>
            ),
          },
        ]}
      />
      <Body2 mt="5" mb="5">
        Unlike other solutions on the market, this means user funds are
        controlled by math, not hardware or people.
      </Body2>
    </Card>
  )
}
