import { FC, ComponentProps } from "react"
import { Box, List, ListItem, HStack } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Body1, Body3, Label3 } from "../../../components/Typography"
import BoxLabel from "../../../components/BoxLabel"
import ExternalLink from "../../../components/ExternalLink"
import { ExternalHref } from "../../../enums"

export const ProvidersCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <Label3>threshold and pre staking providers</Label3>
      <List mt="6" spacing="4">
        {providers.map(renderProviderListItem)}
      </List>

      <BoxLabel my="5" w="fit-content">
        PRE Only
      </BoxLabel>
      <List mt="6" spacing="4">
        {preOnlyProviders.map(renderProviderListItem)}
      </List>
    </Card>
  )
}

type ProviderItem = {
  name: string
  email: string
  link: ExternalHref
}

const ProviderListItem: FC<ProviderItem> = ({ name, email, link }) => (
  <ListItem as={HStack} spacing="4" bg="gray.50" p="4" borderRadius="2">
    <Box bg="brand.500" borderRadius="8px" w="48px" height="48px" />
    <Box>
      <Body1>{name}</Body1>
      <Body3>{email}</Body3>
    </Box>
    <ExternalLink
      fontWeight="600"
      color="gray.700"
      ml="auto !important"
      text="Learn more"
      href={link}
      withArrow
    />
  </ListItem>
)

const renderProviderListItem = (provider: ProviderItem) => (
  <ProviderListItem key={provider.name} {...provider} />
)

const providers = [
  {
    name: "OperatorStaked",
    email: "togilvie@staked.us",
    link: ExternalHref.stakedUs,
  },
  {
    name: "BisonTrails",
    email: "viktor@bisontrails.co",
    link: ExternalHref.bisonTrails,
  },
  {
    name: "BlockDaemon",
    email: "konstantin@blockdaemon.com",
    link: ExternalHref.blackDaemon,
  },
  {
    name: "Boar",
    email: "hello@boar.network",
    link: ExternalHref.boar,
  },
  {
    name: "Figment",
    email: "yannick@figment.io",
    link: ExternalHref.figment,
  },
  {
    name: "Low Fee Validation",
    email: "eduardo@lowfeevalidation.com",
    link: ExternalHref.lowFeeValidation,
  },
]

const preOnlyProviders = [
  {
    name: "Ankr",
    email: "sales@ankr.com",
    link: ExternalHref.ankr,
  },
  {
    name: "P2P Validator",
    email: "hello@p2p.org",
    link: ExternalHref.p2pValidator,
  },
  {
    name: "InfStones",
    email: "contact@infstones.com",
    link: ExternalHref.infStones,
  },
]
