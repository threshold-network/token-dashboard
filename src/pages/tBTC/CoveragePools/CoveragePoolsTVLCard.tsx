import { FC } from "react"
import { H1, BoxProps, Center } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import {
  StatHighlightCard,
  StatHighlightTitle,
  StatHighlightTitleTooltip,
  StatHighlightValue,
} from "../../../components/StatHighlightCard"
import Link, { LinkProps } from "../../../components/Link"
import { ExternalHref } from "../../../enums"

export interface CoveragePoolsTvlCardProps extends BoxProps {
  coveragePoolTvl: string
}

type LearnMoreLinkProps = Omit<LinkProps, "isExternal" | "to">

const LearnMoreLink: FC<LearnMoreLinkProps> = ({ children, ...restProps }) => {
  return (
    <Link isExternal href={ExternalHref.coveragePoolsDocs} {...restProps}>
      {children}
    </Link>
  )
}

export const CoveragePoolsTvlCard: FC<CoveragePoolsTvlCardProps> = ({
  coveragePoolTvl,
  ...restProps
}) => {
  const formattedTvl = formatFiatCurrencyAmount(coveragePoolTvl)
  const tooltipLabel = (
    <>
      Threshold Coverage Pool serves as a backstop for assets secured by the
      tBTC protocol. In the event that secured Bitcoin is los from protocol,
      assets from the coverage pool are withdrawn by the risk manager, converted
      to BTC, an put back into the protocol to achieve the supply peg as closely
      as possible. <LearnMoreLink>Learn more</LearnMoreLink>
    </>
  )
  return (
    <StatHighlightCard {...restProps}>
      <StatHighlightTitle title={"coverage pool tvl"}>
        <StatHighlightTitleTooltip label={tooltipLabel} />
      </StatHighlightTitle>
      <StatHighlightValue value={formattedTvl} />
      <Center>
        <LearnMoreLink m={"0 auto"}>
          Learn more about Coverage Pools
        </LearnMoreLink>
      </Center>
    </StatHighlightCard>
  )
}
