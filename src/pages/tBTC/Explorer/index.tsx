import { FC, useEffect } from "react"
import {
  BodyMd,
  Box,
  Card,
  Divider,
  Flex,
  H1,
  H3,
  H5,
  HStack,
} from "@threshold-network/components"
import { PageComponent } from "../../../types"
import tBTCExplorerBg from "../../../static/images/tBTC-explorer-bg.svg"
import ButtonLink from "../../../components/ButtonLink"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import { ExternalHref } from "../../../enums"

export const ExplorerPage: PageComponent = () => {
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <>
      <Card
        bgImage={tBTCExplorerBg}
        backgroundRepeat="no-repeat"
        backgroundPosition="bottom -25px right"
        backgroundSize="100%"
      >
        <Flex as="header" direction="row" alignItems="center">
          <H5>tBTC TVL</H5>
          <ButtonLink ml="auto" size="lg" to="/tBTC/mint">
            Start Minting
          </ButtonLink>
        </Flex>
        <Divider my="8" />
        <Flex direction="row" alignItems="center">
          <H1>{formatFiatCurrencyAmount(tvlInUSD.tBTC, "0,00.00")} USD</H1>
          <ButtonLink
            size="lg"
            variant="outline"
            href={ExternalHref.tBTCDuneDashboard}
            isExternal
            justifySelf="flex-end"
            ml="auto"
          >
            View On Dune Analytics
          </ButtonLink>
        </Flex>
        <HStack mt="12" justifyContent="space-around">
          <MetricBox value="420.69" label="tBTC" />
          <MetricBox value="420.69" label="tBTC" />
          <MetricBox value="420.69" label="tBTC" />
        </HStack>
      </Card>
    </>
  )
}

const MetricBox: FC<{ value: string; label: string }> = ({ value, label }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      p="3.25rem"
      bg="white"
      textAlign="center"
      borderRadius="2"
      minWidth="294px"
      color="grat.700"
    >
      <H3>{value}</H3>
      <BodyMd>{label}</BodyMd>
    </Box>
  )
}

ExplorerPage.route = {
  title: "tBTC Explorer",
  path: "explorer",
  index: false,
  isPageEnabled: true,
}
