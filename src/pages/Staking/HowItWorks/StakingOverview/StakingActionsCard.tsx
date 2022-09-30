import { FC, ComponentProps } from "react"
import { List, ListItem } from "@chakra-ui/react"
import { LabelSm, BodyMd, BoxLabel, Card } from "@threshold-network/components"

export const StakingActionsCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card gridArea="staking-actions" {...props}>
      <LabelSm>staking actions</LabelSm>
      <List mt="5" spacing="5">
        {stakingActions.map((action) => (
          <ListItem key={action.sectionName}>
            <BoxLabel status="secondary" w="fit-content" mb="4">
              {action.sectionName}
            </BoxLabel>
            <List spacing="4">
              {action.items.map((item, index) => (
                <ListItem key={`${action.sectionName}-${index}}`}>
                  <BodyMd>{item}</BodyMd>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

const stakingActions = [
  {
    sectionName: "Rewards",
    items: ["T rewards are released monthly."],
  },
  {
    sectionName: "Stake Top-ups",
    items: [
      "You can top up your stake with more T tokens via the staking page.",
      "If you want to top up your Legacy stake with Legacy tokens you have to go to the Legacy dashboard in order to do that.",
    ],
  },

  {
    sectionName: "Unstaking",
    items: [
      "Unstaking can be total or partial. For a total unstake you will not be able to use the same Staking Provider Address for new stakes. This unstaked stake becomes an inactive stake and can be topped up anytime you want.",
    ],
  },
]
