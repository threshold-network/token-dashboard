import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { LabelSm, BoxLabel, Card } from "@threshold-network/components"
import LinkDetailsListItem from "../../../../components/LinkDetailsListItem"
import { ExternalHref } from "../../../../enums"

export const ProvidersCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm>threshold and pre staking providers</LabelSm>
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

const renderProviderListItem = (provider: ProviderItem) => (
  <LinkDetailsListItem
    key={provider.name}
    title={provider.name}
    subTitle={provider.email}
    href={provider.link}
  />
)

const providers = [
  {
    name: "Staked",
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
