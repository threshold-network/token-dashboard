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
  ONE_MINUTE_IN_SECONDS,
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
} from "../../../components/TransactionDetails"
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
import { ExternalHref } from "../../../enums"
import {
  useFindRedemptionInBitcoinTx,
  useSubscribeToRedemptionsCompletedEventBase,
} from "../../../hooks/tbtc"
import { useAppDispatch } from "../../../hooks/store"
import { tbtcSlice } from "../../../store/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"

export const UnmintDetails: PageComponent = () => {
  const [searchParams] = useSearchParams()
  const walletPublicKeyHash = searchParams.get("walletPublicKeyHash")
  const redeemerOutputScript = searchParams.get("redeemerOutputScript")
  const redeemer = searchParams.get("redeemer")
  const { redemptionRequestedTxHash } = useParams()
  const dispatch = useAppDispatch()
  const threshold = useThreshold()

  const { data, isFetching, error } = useFetchRedemptionDetails(
    redemptionRequestedTxHash,
    walletPublicKeyHash,
    redeemerOutputScript,
    redeemer
  )
  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [redemptionFromBitcoinTx, setRedemptionFromBitcoinTx] = useState<
    Awaited<ReturnType<typeof findRedemptionInBitcoinTx>> | undefined
  >(undefined)

  useSubscribeToRedemptionsCompletedEventBase(
    async (eventWalletPublicKeyHash, redemptionTxHash, event) => {
      if (eventWalletPublicKeyHash !== walletPublicKeyHash) return

      const redemption = await findRedemptionInBitcoinTx(
        redemptionTxHash,
        event.blockNumber,
        redeemerOutputScript!
      )
      if (!redemption) return

      setRedemptionFromBitcoinTx(redemption)

      if (redemptionRequestedTxHash && redeemerOutputScript) {
        dispatch(
          tbtcSlice.actions.redemptionCompleted({
            redemptionKey: threshold.tbtc.buildRedemptionKey(
              walletPublicKeyHash,
              redeemerOutputScript
            ),
            redemptionRequestedTxHash,
          })
        )
      }
    },
    [],
    true
  )

  const [shouldDisplaySuccessStep, setShouldDisplaySuccessStep] =
    useState(false)

  const _isFetching = (isFetching || !data) && !error
  const wasDataFetched = !isFetching && !!data && !error

  const isProcessCompleted = !!redemptionFromBitcoinTx?.bitcoinTxHash
  const shouldForceIsProcessCompleted =
    !!data?.redemptionCompletedTxHash?.bitcoin

  const requestedAmount = data?.requestedAmount ?? "0"
  const receivedAmount =
    data?.receivedAmount ?? redemptionFromBitcoinTx?.receivedAmount ?? "0"
  const btcTxHash =
    data?.redemptionCompletedTxHash?.bitcoin ??
    redemptionFromBitcoinTx?.bitcoinTxHash

  const thresholdNetworkFee = data?.treasuryFee ?? "0"
  const btcAddress = data?.btcAddress ?? redemptionFromBitcoinTx?.btcAddress
  const redemptionCompletedAt =
    data?.completedAt ?? redemptionFromBitcoinTx?.redemptionCompletedTimestamp
  const redemptionRequestedAt = data?.requestedAt
  const [redemptionTime, setRedemptionTime] = useState<
    ReturnType<typeof dateAs>
  >({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    if (!redemptionCompletedAt && redemptionRequestedAt) {
      intervalId = setInterval(() => {
        setRedemptionTime(
          dateAs(
            redemptionCompletedAt ??
              dateToUnixTimestamp() - (data?.requestedAt ?? 0)
          )
        )
      }, ONE_MINUTE_IN_SECONDS)
    } else if (redemptionCompletedAt && redemptionRequestedAt) {
      setRedemptionTime(dateAs(redemptionCompletedAt - redemptionRequestedAt))
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [redemptionCompletedAt, redemptionRequestedAt])

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
      txHash: btcTxHash,
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
                usual duration - 3-5 hours
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
                status={
                  isProcessCompleted || shouldForceIsProcessCompleted
                    ? "active"
                    : "semi-active"
                }
              >
                <TimelineBreakpoint>
                  <TimelineDot position="relative">
                    {(isProcessCompleted || shouldForceIsProcessCompleted) && (
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
            {shouldDisplaySuccessStep || shouldForceIsProcessCompleted ? (
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
                txHash={redemptionRequestedTxHash}
                progressBarColor="brand.500"
                isCompleted={isProcessCompleted}
                icon={<ProcessCompletedBrandGradientIcon />}
                onComplete={() => setShouldDisplaySuccessStep(true)}
                isIndeterminate
              >
                <BodyMd mt="6" px="3.5" mb="10" alignSelf="flex-start">
                  Your redemption request is being processed. This will take
                  around 3-5 hours.
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
              {`${redemptionTime.days}d ${redemptionTime.hours}h ${redemptionTime.minutes}m`}
            </BodyLg>

            <LabelSm mt="5">Transaction History</LabelSm>
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
