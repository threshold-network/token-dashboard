import { FC, ComponentProps } from "react"
import { List, ListItem } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"
import BoxLabel from "../../../components/BoxLabel"

export const StakingActionsCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card gridArea="staking-actions">
      <Label3>staking actions</Label3>
      <List mt="5" spacing="6">
        {stakingActions.map((action) => (
          <ListItem>
            <BoxLabel w="fit-content" mb="5">
              {action.sectionName}
            </BoxLabel>
            <List spacing="4">
              {action.items.map((item) => (
                <ListItem>{item}</ListItem>
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
      "Top-ups are done in T tokens.",
      "If you want to top up your Legacy stake with Legacy tokens you have to go to the Legacy dashboard in order to do that.",
    ],
  },

  {
    sectionName: "Unstaking",
    items: [
      "Unstaking can be total or partial. For a total unstake you will not be able to use the same Operator Address for new stakes. This unstaked stake becomes an inactive stake and  can be toppped up anytime you want.",
    ],
  },
]
