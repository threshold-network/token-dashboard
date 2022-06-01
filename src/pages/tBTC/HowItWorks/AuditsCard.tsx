import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"
import LinkDetailsListItem from "../../../components/LinkDetailsListItem"

export const AuditsCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <Label3 mb={5}>Audit Reports</Label3>
      <List mt="5" spacing="6">
        {contracts.map((contract) => (
          <LinkDetailsListItem {...contract} />
        ))}
      </List>
    </Card>
  )
}

const contracts = [
  {
    title: "Spearbit",
    href: "NEED_URL",
  },
  {
    title: "Audit Bridge",
    href: "NEED_URL",
  },
]
