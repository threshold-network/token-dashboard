import { FC, ComponentProps } from "react"
import { List, ListItem } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"
import BoxLabel from "../../../components/BoxLabel"

export const AboutAddressesCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <Label3>about the Addresses you need to provide</Label3>
      <List mt="5" spacing="6">
        {aboutAddresses.map((action) => (
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

const aboutAddresses = [
  {
    sectionName: "Provider Address",
    items: [
      "It’s the address that will be used to set up your nodes. One Provider Address per Stake.",
    ],
  },
  {
    sectionName: "Beneficiary Address",
    items: [
      "This is the address where your rewards will be sent when claimed. You can have the same Beneficiary Address for multiple stakes.",
    ],
  },

  {
    sectionName: "Authorizer Address",
    items: [
      "This address authorizes which applications can use the funds from your staking pool. It can be the same as your Beneficiary Address. You can have the same Authorizer Address for multiple stakes.",
    ],
  },
]
