import { FC } from "react"
import { List, ListProps } from "@threshold-network/components"
import { ExternalHref } from "../../enums"
import DetailedLinkListItem from "../DetailedLinkListItem"
import StakedLogo from "../../static/images/stakingProviders/StakedLogo.png"
import BoarLogo from "../../static/images/stakingProviders/BoarLogo.png"
import P2PValidatorLogo from "../../static/images/stakingProviders/P2PValidatorLogo.png"
import InfStonesLogo from "../../static/images/stakingProviders/InfStonesLogo.png"
import DelightLogo from "../../static/images/stakingProviders/DelightLogo.svg"

type ProviderItem = {
  name: string
  email: string
  link: ExternalHref
  imgSrc: any
}

const renderProviderListItem = (provider: ProviderItem) => (
  <DetailedLinkListItem
    key={provider.name}
    title={provider.name}
    subtitle={provider.email}
    href={provider.link}
    imgSrc={provider.imgSrc}
  />
)

const providers: ProviderItem[] = [
  {
    name: "Boar",
    email: "hello@boar.network",
    link: ExternalHref.boar,
    imgSrc: BoarLogo,
  },
  {
    name: "DELIGHT",
    email: "contact@delightlabs.io",
    link: ExternalHref.delight,
    imgSrc: DelightLogo,
  },
  {
    name: "InfStones",
    email: "sales@infstones.com",
    link: ExternalHref.infStones,
    imgSrc: InfStonesLogo,
  },
  {
    name: "P2P",
    email: "am@p2p.org",
    link: ExternalHref.p2pValidator,
    imgSrc: P2PValidatorLogo,
  },
  {
    name: "Staked",
    email: "staked@staked.us",
    link: ExternalHref.stakedUs,
    imgSrc: StakedLogo,
  },
]

export const AllAppsProvidersList: FC<ListProps> = (props) => {
  return (
    <List spacing="4" {...props}>
      {providers.map(renderProviderListItem)}
    </List>
  )
}
