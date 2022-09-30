import { FC, ComponentProps } from "react"
import { List, ListItem } from "@chakra-ui/react"
import { LabelSm, BodyMd, BoxLabel, Card } from "@threshold-network/components"

export const AboutAddressesCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm>about the Addresses you need to provide</LabelSm>
      <List mt="5" spacing="5">
        {aboutAddresses.map((action) => (
          <ListItem key={action.sectionName}>
            <BoxLabel status="secondary" w="fit-content" mb="4">
              {action.sectionName}
            </BoxLabel>
            <List spacing="4">
              {action.items.map((item, index) => (
                <ListItem key={`${action.sectionName}-${index}`}>
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

const aboutAddresses = [
  {
    sectionName: "Provider Address",
    items: [
      "This address will be used to set up your nodes. There can only be one unique Provider address per stake, and this address cannot be reused",
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
      "We recommend that the authorizer address matches your connected wallet.",
    ],
  },
]
