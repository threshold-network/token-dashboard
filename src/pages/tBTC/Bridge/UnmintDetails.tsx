import { FC, useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { IoCheckmarkSharp } from "react-icons/all"
import {
  Badge,
  BodyLg,
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  Divider,
  H5,
  Icon,
  LabelSm,
  List,
  ListItem,
  SkeletonText,
  useColorModeValue,
} from "@threshold-network/components"
import {
  Timeline,
  TimelineBreakpoint,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
} from "../../../components/Timeline"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../components/TransacionDetails"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import ButtonLink from "../../../components/ButtonLink"
import { BridgeProcessStep } from "./components/BridgeProcessStep"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import { BridgeProcessCardSubTitle } from "./components/BridgeProcessCardSubTitle"
import { BridgeProcessResource } from "./components/BridgeProcessResource"
import { BridgeProcessDetailsCard } from "./components/BridgeProcessDetailsCard"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { PageComponent } from "../../../types"
import { dateToUnixTimestamp, dateAs } from "../../../utils/date"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"
import { ProcessCompletedBrandGradientIcon } from "./components/BridgeProcessDetailsIcons"
import { featureFlags } from "../../../constants"
import { useFetchRedemptionDetails } from "../../../hooks/tbtc/useFetchRedemptionDetails"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import { BigNumber } from "ethers"
import { ExternalHref } from "../../../enums"

const pendingRedemption = {
  redemptionRequestedTxHash:
    "0xf7d0c92c8de4d117d915c2a8a54ee550047f926bc00b91b651c40628751cfe29",
  walletPublicKeyHash: "0x03b74d6893ad46dfdd01b9e0e3b3385f4fce2d1e",
  redeemerOutputScript: "0x160014751E76E8199196D454941C45D1B3A323F1433BD6",
  redeemer: "0x086813525A7dC7dafFf015Cdf03896Fd276eab60",
}

const completedRedemption = {
  redemptionRequestedTxHash:
    "0x0b5d66b89c5fe276ac5b0fd1874142f99329ea6f66485334a558e2bccd977618",
  walletPublicKeyHash: "0x03b74d6893ad46dfdd01b9e0e3b3385f4fce2d1e",
  redeemerOutputScript: "0x17A91486884E6BE1525DAB5AE0B451BD2C72CEE67DCF4187",
  redeemer: "0x68ad60CC5e8f3B7cC53beaB321cf0e6036962dBc",
}

export const UnmintDetails: PageComponent = () => {
  const [searchParams] = useSearchParams()
  const walletPublicKeyHash = searchParams.get("walletPublicKeyHash")
  const redeemerOutputScript = searchParams.get("redeemerOutputScript")
  const redeemer = searchParams.get("redeemer")
  const { redemptionRequestedTxHash } = useParams()

  const { data, isFetching, error } = useFetchRedemptionDetails(
    redemptionRequestedTxHash,
    walletPublicKeyHash,
    redeemerOutputScript,
    redeemer
  )

  const [shouldDisplaySuccessStep, setShouldDisplaySuccessStep] =
    useState(false)

  const _isFetching = (isFetching || !data) && !error
  const wasDataFetched = !isFetching && !!data && !error

  const btcTxHash = data?.redemptionCompletedTxHash?.bitcoin
  useEffect(() => {
    if (!!btcTxHash) setShouldDisplaySuccessStep(true)
  }, [btcTxHash])

  const isProcessCompleted = !!data?.redemptionCompletedTxHash?.bitcoin
  // requested unmint amount of tBTC in satoshi!. This means that this value is
  // the amount before subtracting the fees.
  const requestedAmount = data?.requestedAmount ?? "0"
  const receivedAmount = data?.receivedAmount ?? "0"

  const thresholdNetworkFee = data?.treasuryFee ?? "0"
  const btcAddress = data?.btcAddress
  const time = dateAs(
    (data?.completedAt ?? dateToUnixTimestamp()) - (data?.requestedAt ?? 0)
  )

  const transactions: {
    label: string
    txHash?: string
    chain: ViewInBlockExplorerChain
  }[] = [
    {
      label: "Unwrap",
      txHash: data?.redemptionRequestedTxHash,
      chain: "ethereum",
    },
    {
      label: "BTC sent",
      txHash: data?.redemptionCompletedTxHash?.bitcoin,
      chain: "bitcoin",
    },
  ]

  const timelineBadgeBgColor = useColorModeValue("white", "brand.800")

  return (
    <BridgeLayout
      as={BridgeProcessDetailsCard}
      spacing="4"
      // @ts-ignore
      isProcessCompleted={shouldDisplaySuccessStep}
    >
      <BridgeLayoutMainSection>
        {_isFetching && <BridgeProcessDetailsPageSkeleton />}
        {error && <>{error}</>}
        {wasDataFetched && (
          <>
            <BridgeProcessCardTitle bridgeProcess="unmint" />
            <BridgeProcessCardSubTitle
              display="flex"
              stepText={shouldDisplaySuccessStep ? "Unminted" : "Unminting"}
            >
              {!shouldDisplaySuccessStep && (
                <Box as="span" ml="2">
                  {" "}
                  - In progress...
                </Box>
              )}
              <InlineTokenBalance
                tokenAmount={requestedAmount}
                withSymbol
                tokenSymbol="tBTC"
                ml="auto"
                precision={6}
                higherPrecision={8}
              />
            </BridgeProcessCardSubTitle>
            <Timeline>
              <Badge
                variant="subtle"
                size="sm"
                bg={timelineBadgeBgColor}
                position="absolute"
                bottom="10px"
                left="50%"
                transform="translateX(-50%)"
              >
                usual duration - 3 hours
              </Badge>
              <TimelineItem status="active">
                <TimelineBreakpoint>
                  <TimelineDot position="relative">
                    <Icon
                      as={IoCheckmarkSharp}
                      position="absolute"
                      color="white"
                      w="22px"
                      h="22px"
                      m="auto"
                      left="0"
                      right="0"
                      textAlign="center"
                    />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineBreakpoint>
                <TimelineContent>
                  <BodyXs whiteSpace="pre-line">tBTC unwrapped</BodyXs>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem
                status={isProcessCompleted ? "active" : "semi-active"}
              >
                <TimelineBreakpoint>
                  <TimelineDot position="relative">
                    {isProcessCompleted && (
                      <Icon
                        as={IoCheckmarkSharp}
                        position="absolute"
                        color="white"
                        w="22px"
                        h="22px"
                        m="auto"
                        left="0"
                        right="0"
                        textAlign="center"
                      />
                    )}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineBreakpoint>
                <TimelineContent>
                  <BodyXs whiteSpace="pre-line">BTC sent</BodyXs>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
            {shouldDisplaySuccessStep || isProcessCompleted ? (
              <SuccessStep
                requestedAmount={requestedAmount}
                receivedAmount={receivedAmount}
                thresholdNetworkFee={thresholdNetworkFee}
                btcAddress={btcAddress!}
              />
            ) : (
              <BridgeProcessStep
                title="Unminting in progress"
                chain="ethereum"
                txHash={"0x0"}
                progressBarColor="brand.500"
                isCompleted={isProcessCompleted}
                icon={<ProcessCompletedBrandGradientIcon />}
                onComplete={() => setShouldDisplaySuccessStep(true)}
                isIndeterminate
              >
                <BodyMd mt="6" px="3.5" mb="10" alignSelf="flex-start">
                  Your redemption request is being processed. This will take
                  around 5 hours.
                </BodyMd>
              </BridgeProcessStep>
            )}
          </>
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection
        alignSelf="stretch"
        display="flex"
        flex="1"
        flexDirection="column"
      >
        {_isFetching ? (
          <AsideSectionSkeleton />
        ) : (
          <>
            <LabelSm>
              {isProcessCompleted ? "total time" : "elapsed time"}
            </LabelSm>
            <BodyLg mt="2.5" color="gray.500">
              {`${time.days}d ${time.hours}h ${time.minutes}m`}
            </BodyLg>

            <LabelSm mt="5">Transacion History</LabelSm>
            <List mt="6" color="gray.500" spacing="2" mb="20">
              {transactions
                .filter((item) => !!item.txHash)
                .map((item) => (
                  <ListItem key={item.txHash}>
                    <BodySm>
                      {item.label}{" "}
                      <ViewInBlockExplorer
                        id={item.txHash!}
                        type={ExplorerDataType.TRANSACTION}
                        chain={item.chain}
                        text="transaction"
                      />
                      .
                    </BodySm>
                  </ListItem>
                ))}
            </List>
            {!shouldDisplaySuccessStep && (
              <BridgeProcessResource
                title="Minters and Guardians in Optimistic Minting"
                subtitle="A phased approach with two main roles: Minters and Guardians."
                link={ExternalHref.mintersAndGuardiansDocs}
              />
            )}
          </>
        )}
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

const SuccessStep: FC<{
  requestedAmount: string
  receivedAmount: string
  thresholdNetworkFee: string
  btcAddress: string
}> = ({ requestedAmount, receivedAmount, thresholdNetworkFee, btcAddress }) => {
  return (
    <>
      <H5 mt="4">Success!</H5>
      <Divider mt="9" mb="4" />
      <List spacing="4">
        <TransactionDetailsAmountItem
          label="Unminted Amount"
          tokenAmount={requestedAmount}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsAmountItem
          label="Received Amount"
          tokenAmount={receivedAmount}
          tokenSymbol="BTC"
          tokenDecimals={8}
          precision={6}
          higherPrecision={8}
          withHigherPrecision
        />
        <TransactionDetailsAmountItem
          label="Threshold Network Fee"
          tokenAmount={thresholdNetworkFee}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsItem label="BTC address">
          <CopyAddressToClipboard
            address={btcAddress}
            chain="bitcoin"
            withLinkToBlockExplorer
            fontSize="14px"
          />
        </TransactionDetailsItem>
      </List>
      <ButtonLink mt="8" size="lg" to="/tBTC/mint" width="100%">
        New Mint
      </ButtonLink>
    </>
  )
}

const AsideSectionSkeleton: FC = () => {
  return (
    <>
      <SkeletonText noOfLines={1} />
      <SkeletonText noOfLines={1} skeletonHeight={6} mt="4" />

      <SkeletonText noOfLines={1} mt="4" />
      <SkeletonText noOfLines={2} mt="4" />
    </>
  )
}

UnmintDetails.route = {
  path: "redemption/:redemptionRequestedTxHash",
  index: false,
  isPageEnabled: featureFlags.TBTC_V2_REDEMPTION,
}
