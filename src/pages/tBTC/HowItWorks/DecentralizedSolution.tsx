import { FC, ComponentProps } from "react"
import {
  BodyMd,
  LabelSm,
  Card,
  ChecklistGroup,
} from "@threshold-network/components"
import ExternalLink from "../../../components/ExternalLink"

export const DecentralizedSolution: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="5">A Decentralized Solution</LabelSm>
      <BodyMd mb="5">
        tBTC v2 replaces centralized intermediaries with a randomly selected
        group of operators running nodes on the Threshold Network.
      </BodyMd>
      <ChecklistGroup
        title="How this works"
        checklistItems={[
          {
            itemId: "threshold-cryptography",
            itemTitle: (
              <BodyMd>
                The group of independent operators works together to secure your
                deposited Bitcoin through{" "}
                <ExternalLink
                  text="threshold cryptography"
                  href="NEED_URL"
                  withArrow
                />
              </BodyMd>
            ),
          },
          {
            itemId: "threshold-majority",
            itemTitle: (
              <BodyMd>
                tBTC v2 requires a threshold majority(51/100) of these operators
                to agree to access or perform any action with your Bitcoin.
              </BodyMd>
            ),
          },
          {
            itemId: "threshold-rotation",
            itemTitle: (
              <BodyMd>
                By rotating the selection of operators weekly, tBTC v2 protects
                against any individual or group of operators seizing control.
              </BodyMd>
            ),
          },
        ]}
      />
      <BodyMd mt="5" mb="5">
        Unlike other solutions on the market, this means user funds are
        controlled by math, not hardware or people.
      </BodyMd>
    </Card>
  )
}
