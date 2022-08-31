import { FC } from "react"
import { Box, Grid, List, Card, LabelSm } from "@threshold-network/components"
import DetailedLinkListItem from "../../../../components/DetailedLinkListItem"
import { ExternalHref } from "../../../../enums"
import StakedLogo from "../../../../static/images/stakingProviders/StakedLogo.png"
import BisonTrailsLogo from "../../../../static/images/stakingProviders/BisonTrailsLogo.png"
import BlockDaemonLogo from "../../../../static/images/stakingProviders/BlockDaemonLogo.png"
import BoarLogo from "../../../../static/images/stakingProviders/BoarLogo.png"
import FigmentLogo from "../../../../static/images/stakingProviders/FigmentLogo.png"
import LowFeeValidationLogo from "../../../../static/images/stakingProviders/LowFeeValidationLogo.png"
import AnkrLogo from "../../../../static/images/stakingProviders/AnkrLogo.png"
import P2PValidatorLogo from "../../../../static/images/stakingProviders/P2PValidatorLogo.png"
import InfStonesLogo from "../../../../static/images/stakingProviders/InfStonesLogo.png"

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
    name: "BlockDaemon",
    email: "konstantin@blockdaemon.com",
    link: ExternalHref.blockDaemon,
    imgSrc: BlockDaemonLogo,
  },
  {
    name: "Boar",
    email: "hello@boar.network",
    link: ExternalHref.boar,
    imgSrc: BoarLogo,
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
    name: "P2P Validator",
    email: "hello@p2p.org",
    link: ExternalHref.p2pValidator,
    imgSrc: P2PValidatorLogo,
  },
  {
    name: "InfStones",
    email: "contact@infstones.com",
    link: ExternalHref.infStones,
    imgSrc: InfStonesLogo,
  },
]

const StakingProviders: FC = () => {
  return (
    <Box>
      <Grid
        gridAutoColumns="minmax(0, 1fr)"
        gridAutoFlow="column"
        gridTemplate={{
          base: `
            "providers"
            "pre-providers"
          `,
          xl: `"providers   pre-providers"`,
        }}
        gridGap="4"
      >
        <Card gridArea="providers" h="fit-content">
          <LabelSm>staking providers</LabelSm>
          <List mt="6" spacing="4">
            {providers.map(renderProviderListItem)}
          </List>
        </Card>

        <Card gridArea="pre-providers" h="fit-content">
          <LabelSm>Pre only staking providers</LabelSm>
          <List mt="6" spacing="4">
            {preOnlyProviders.map(renderProviderListItem)}
          </List>
        </Card>
      </Grid>
    </Box>
  )
}

export default StakingProviders
