import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { Card, LabelSm } from "@threshold-network/components"
import DetailedLinkListItem from "../../../components/DetailedLinkListItem"

export const ContractsCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm mb={5}>Contracts</LabelSm>
      <List mt="5" spacing="6">
        {contracts.map((contract) => (
          <DetailedLinkListItem {...contract} />
        ))}
      </List>
    </Card>
  )
}

const contracts = [
  {
    title: "Token Contract",
    href: "NEED_URL",
  },
  {
    title: "Bridge Contract",
    href: "NEED_URL",
  },
]
