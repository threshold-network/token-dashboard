import { FC, useEffect } from "react"
import {
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  Card,
  Divider,
  Flex,
  H1,
  H3,
  H5,
  HStack,
  LabelSm,
  LabelXs,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@threshold-network/components"
import { PageComponent } from "../../../types"
import tBTCExplorerBg from "../../../static/images/tBTC-explorer-bg.svg"
import ButtonLink from "../../../components/ButtonLink"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import {
  formatFiatCurrencyAmount,
  formatNumeral,
} from "../../../utils/formatAmount"
import { ExternalHref } from "../../../enums"
import { TBTCText } from "../../../components/tBTC"
import Identicon from "../../../components/Identicon"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import shortenAddress from "../../../utils/shortenAddress"
import { getRelativeTime } from "../../../utils/date"
import { createLinkToBlockExplorerForChain } from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import {
  RecentDeposit,
  useFetchRecentDeposits,
  useFetchTBTCMetrics,
} from "../../../hooks/tbtc"

const MINTS_TO_DISPLAY = 10

export const ExplorerPage: PageComponent = () => {
  const { metrics } = useFetchTBTCMetrics()
  const [latestMints] = useFetchRecentDeposits(MINTS_TO_DISPLAY)
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <>
      <Card
        as="section"
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
        <Flex direction={{ base: "column", xl: "row" }} alignItems="center">
          <H1>{formatFiatCurrencyAmount(tvlInUSD.tBTC, "0,00.00")} USD</H1>
          <ButtonLink
            size="lg"
            variant="outline"
            href={ExternalHref.tBTCDuneDashboard}
            isExternal
            justifySelf="flex-end"
            ml={{ xl: "auto" }}
            mt={{ base: 4, xl: "unset" }}
          >
            View On Dune Analytics
          </ButtonLink>
        </Flex>
        <Stack
          mb={{ base: "10", sm: "32", xl: "unset" }}
          spacing="4"
          mt="12"
          direction={{ base: "column", xl: "row" }}
          justifyContent="space-between"
        >
          <MetricBox>
            <H3>
              <InlineTokenBalance tokenAmount={tvl.tBTC} />
            </H3>
            <BodyMd>
              <TBTCText />
            </BodyMd>
          </MetricBox>
          <SimpleMetricBox
            value={formatNumeral(metrics.totalMints, "0,00")}
            label="Total Mints"
          />
          <SimpleMetricBox
            value={formatNumeral(metrics.totalHolders, "0,00")}
            label="tBTC Holding Addresses"
          />
        </Stack>
      </Card>
      <Card mt="4" as="section">
        <LabelSm as="header">History</LabelSm>
        <TableContainer mt="6">
          <Table variant="simple">
            <Thead color="gray.500">
              <Tr>
                <Th paddingLeft={12}>
                  <LabelXs color="gray.500">
                    <TBTCText /> amount
                  </LabelXs>
                </Th>
                <Th>
                  <LabelXs>Wallet Address</LabelXs>
                </Th>
                <Th>
                  <LabelXs>TX Hash</LabelXs>
                </Th>
                <Th textAlign={"right"}>
                  <LabelXs>Timestamp</LabelXs>
                </Th>
              </Tr>
            </Thead>
            <Tbody>{latestMints.map(renderHistoryRow)}</Tbody>
          </Table>
        </TableContainer>
        <BodySm color="gray.500" mt="2">
          Showing {MINTS_TO_DISPLAY} out of {metrics.totalMints} transactions
        </BodySm>
      </Card>
    </>
  )
}

const renderHistoryRow = (item: RecentDeposit) => (
  <HistoryRow key={item.txHash} {...item} />
)

const HistoryRow: FC<RecentDeposit> = ({ txHash, address, amount, date }) => {
  return (
    <LinkBox
      as={Tr}
      key={`latest-mints-${txHash}`}
      _odd={{ backgroundColor: useColorModeValue("gray.50", "gray.700") }}
      sx={{ td: { borderBottom: "none" } }}
      transform="scale(1)"
    >
      <Td paddingLeft={12}>
        <BodyXs>
          <InlineTokenBalance
            tokenAmount={amount}
            withSymbol
            tokenSymbol="tBTC"
          />
        </BodyXs>
      </Td>
      <Td>
        <HStack>
          <Identicon address={address} />
          <BodyXs textStyle="chain-identifier">
            {shortenAddress(address)}
          </BodyXs>
        </HStack>
      </Td>
      <Td>
        <LinkOverlay
          as={Link}
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
          color="inherit"
          isExternal
          href={createLinkToBlockExplorerForChain.ethereum(
            txHash,
            ExplorerDataType.TRANSACTION
          )}
        >
          <BodyXs textStyle="chain-identifier">{shortenAddress(txHash)}</BodyXs>
        </LinkOverlay>
      </Td>
      <Td textAlign={"right"}>
        <BodyXs>{getRelativeTime(Number(date))}</BodyXs>
      </Td>
    </LinkBox>
  )
}

const SimpleMetricBox: FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  return (
    <MetricBox>
      <H3>{value}</H3>
      <BodyMd>{label}</BodyMd>
    </MetricBox>
  )
}

const MetricBox: FC = ({ children }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      p="3.25rem"
      bg={useColorModeValue("white", "gray.700")}
      textAlign="center"
      borderRadius="2"
      minWidth="294px"
      color="gray.700"
    >
      {children}
    </Box>
  )
}

ExplorerPage.route = {
  title: "tBTC Explorer",
  path: "explorer",
  index: false,
  isPageEnabled: true,
}
