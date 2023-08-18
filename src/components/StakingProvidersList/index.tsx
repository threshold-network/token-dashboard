import { FC } from "react"
import { List, ListProps } from "@threshold-network/components"
import { ExternalHref } from "../../enums"
import DetailedLinkListItem from "../DetailedLinkListItem"
import StakedLogo from "../../static/images/stakingProviders/StakedLogo.png"
import BisonTrailsLogo from "../../static/images/stakingProviders/BisonTrailsLogo.png"
import BoarLogo from "../../static/images/stakingProviders/BoarLogo.png"
import FigmentLogo from "../../static/images/stakingProviders/FigmentLogo.png"
import LowFeeValidationLogo from "../../static/images/stakingProviders/LowFeeValidationLogo.png"
import AnkrLogo from "../../static/images/stakingProviders/AnkrLogo.png"
import P2PValidatorLogo from "../../static/images/stakingProviders/P2PValidatorLogo.png"
import InfStonesLogo from "../../static/images/stakingProviders/InfStonesLogo.png"

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
    name: "P2P Validator",
    email: "hello@p2p.org",
    link: ExternalHref.p2pValidator,
    imgSrc: P2PValidatorLogo,
  },
  {
    name: "Staked",
    email: "togilvie@staked.us",
    link: ExternalHref.stakedUs,
    imgSrc: StakedLogo,
  },
  {
    name: "BisonTrails",
    email: "viktor@bisontrails.co",
    link: ExternalHref.bisonTrails,
    imgSrc: BisonTrailsLogo,
  },
  {
    name: "Figment",
    email: "yannick@figment.io",
    link: ExternalHref.figment,
    imgSrc: FigmentLogo,
  },
  {
    name: "Low Fee Validation",
    email: "eduardo@lowfeevalidation.com",
    link: ExternalHref.lowFeeValidation,
    imgSrc: LowFeeValidationLogo,
  },
]

const preOnlyProviders = [
  {
    name: "Ankr",
    email: "sales@ankr.com",
    link: ExternalHref.ankr,
    imgSrc: AnkrLogo,
  },
  {
    name: "InfStones",
    email: "contact@infstones.com",
    link: ExternalHref.infStones,
    imgSrc: InfStonesLogo,
  },
]

export const AllAppsProvidersList: FC<ListProps> = (props) => {
  return (
    <List mt="6" spacing="4" {...props}>
      {providers.map(renderProviderListItem)}
    </List>
  )
}

export const PreOnlyProvidersList: FC<ListProps> = (props) => {
  return (
    <List mt="6" spacing="4" {...props}>
      {preOnlyProviders.map(renderProviderListItem)}
    </List>
  )
}
