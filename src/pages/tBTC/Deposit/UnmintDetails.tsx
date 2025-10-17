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
import { ExplorerDataType } from "../../../networks/enums/networks"
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
  useFetchVaaFromTxHash,
  useFetchL2RedemptionRequestedEvent,
} from "../../../hooks/tbtc"
import { useFetchCrossChainRedemptionDetails } from "../../../hooks/tbtc/useFetchCrossChainRedemptionDetails"
import { useSubscribeToL1BitcoinRedeemerRedemptionRequestedEvent } from "../../../hooks/tbtc/useSubscribeToL1BitcoinRedeemerRedemptionRequestedEvent"
import { useAppDispatch } from "../../../hooks/store"
import { tbtcSlice } from "../../../store/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { ChainName } from "../../../threshold-ts/types"
import { ethers } from "ethers"

export const UnmintDetails: PageComponent = () => {
  const [searchParams] = useSearchParams()
  const { redemptionRequestedTxHash: txHashFromParams } = useParams()
  const [walletPublicKeyHash, setWalletPublicKeyHash] = useState<
    string | undefined
  >(searchParams.get("walletPublicKeyHash") || undefined)
  const [redemptionRequestedTxHash, setRedemptionRequestedTxHash] = useState<
    string | undefined
  >(txHashFromParams || undefined)
  const redeemerOutputScript = searchParams.get("redeemerOutputScript")
  const redeemer = searchParams.get("redeemer")
  const chainName = searchParams.get("chainName")
  const dispatch = useAppDispatch()
  const threshold = useThreshold()
  const isCrossChainRedemption = !!chainName && chainName !== ChainName.Ethereum

  const { data: l2RedemptionEvent, isFetching: isFetchingL2Event } =
    useFetchL2RedemptionRequestedEvent(
      isCrossChainRedemption ? txHashFromParams : null,
      isCrossChainRedemption
    )

  const { data: vaaData, error: vaaError } = useFetchVaaFromTxHash(
    isCrossChainRedemption ? txHashFromParams : null,
    isCrossChainRedemption
  )

  const {
    data: crossChainData,
    isFetching: isFetchingCrossChain,
    error: crossChainError,
  } = useFetchCrossChainRedemptionDetails(
    isCrossChainRedemption ? redeemerOutputScript : null,
    isCrossChainRedemption ? redeemer : null,
    vaaData?.encodedVm
  )

  // Use regular redemption details for L1 redemptions
  const {
    data: l1Data,
    isFetching: isFetchingL1,
    error: l1Error,
  } = useFetchRedemptionDetails(
    isCrossChainRedemption ? null : redemptionRequestedTxHash,
    isCrossChainRedemption ? null : walletPublicKeyHash,
    isCrossChainRedemption ? null : redeemerOutputScript,
    isCrossChainRedemption ? null : redeemer
  )

  // Combine data from both hooks
  const data = isCrossChainRedemption
    ? crossChainData ?? l2RedemptionEvent
    : l1Data
  const isFetching = isCrossChainRedemption ? isFetchingL2Event : isFetchingL1
  const error = isCrossChainRedemption ? vaaError || crossChainError : l1Error

  // Update state variables when cross-chain data is fetched
  useEffect(() => {
    if (isCrossChainRedemption && crossChainData) {
      setWalletPublicKeyHash(crossChainData.walletPublicKeyHash)
      setRedemptionRequestedTxHash(crossChainData.redemptionRequestedTxHash)
    }
  }, [isCrossChainRedemption, crossChainData])

  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [redemptionFromBitcoinTx, setRedemptionFromBitcoinTx] = useState<
    Awaited<ReturnType<typeof findRedemptionInBitcoinTx>> | undefined
  >(undefined)

  // Subscribe to L1BitcoinRedeemer RedemptionRequested events for cross-chain redemptions
  useSubscribeToL1BitcoinRedeemerRedemptionRequestedEvent(
    async (
      redemptionKey,
      eventWalletPublicKeyHash,
      mainUtxo,
      eventRedeemerOutputScript,
      amount,
      event
    ) => {
      // If we have encodedVm, filter by it
      if (vaaData?.encodedVm) {
        const eventEncodedVm = event.args?.encodedVm
        if (!eventEncodedVm) {
          return
        }

        // Convert encodedVm Uint8Array to hex string for comparison
        const encodedVmHex = ethers.utils.hexlify(vaaData.encodedVm)

        if (eventEncodedVm.toLowerCase() !== encodedVmHex.toLowerCase()) {
          return
        }
      }

      // Update state with the wallet public key hash and tx hash from the event
      setWalletPublicKeyHash(eventWalletPublicKeyHash)
      setRedemptionRequestedTxHash(event.transactionHash)

      // Dispatch redemption requested action
      dispatch(
        tbtcSlice.actions.redemptionRequested({
          redemptionKey: redemptionKey.toString(),
          blockNumber: event.blockNumber,
          amount: amount.toString(),
          txHash: event.transactionHash,
          additionalData: {
            redeemerOutputScript: eventRedeemerOutputScript,
            walletPublicKeyHash: eventWalletPublicKeyHash,
          },
        })
      )
    },
    [null, null, null, redeemerOutputScript],
    isCrossChainRedemption
  )

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

      if (
        redemptionRequestedTxHash &&
        redeemerOutputScript &&
        walletPublicKeyHash
      ) {
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
    walletPublicKeyHash ? [walletPublicKeyHash] : [],
    true
  )

  const [shouldDisplaySuccessStep, setShouldDisplaySuccessStep] =
    useState(false)

  const _isFetching = isCrossChainRedemption
    ? isFetchingL2Event || isFetchingCrossChain
    : isFetching || !data

  // For cross-chain redemptions, check if we have the expected L1 redemption
  const isRedemptionRequested = isCrossChainRedemption
    ? !!data?.redemptionRequestedTxHash && !!vaaData
    : !!redemptionRequestedTxHash
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
          dateAs(dateToUnixTimestamp() - (redemptionRequestedAt ?? 0))
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
      isProcessCompleted={
        shouldDisplaySuccessStep || shouldForceIsProcessCompleted
      }
    >
      {error ? (
        <Box w="full">{error}</Box>
      ) : (
        <BridgeLayoutMainSection>
          {_isFetching ? (
            <BridgeProcessDetailsPageSkeleton />
          ) : (
            <>
              <BridgeProcessCardTitle bridgeProcess="unmint" />
              <BridgeProcessCardSubTitle
                display="flex"
                stepText={
                  shouldDisplaySuccessStep || shouldForceIsProcessCompleted
                    ? "Unminted"
                    : "Unminting"
                }
              >
                {!(
                  shouldDisplaySuccessStep || shouldForceIsProcessCompleted
                ) && (
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
                  bottom="-25px"
                  left="50%"
                  transform="translateX(-50%)"
                >
                  usual duration - 3-5 hours
                </Badge>
                {l2RedemptionEvent && (
                  <TimelineItem
                    status={l2RedemptionEvent ? "active" : "semi-active"}
                  >
                    <TimelineBreakpoint>
                      <TimelineDot position="relative">
                        {l2RedemptionEvent && (
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
                      <BodyXs whiteSpace="pre-line">tBTC sent to L1</BodyXs>
                    </TimelineContent>
                  </TimelineItem>
                )}
                <TimelineItem
                  status={isRedemptionRequested ? "active" : "semi-active"}
                >
                  <TimelineBreakpoint>
                    <TimelineDot position="relative">
                      {isRedemptionRequested && (
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
                    <BodyXs whiteSpace="pre-line">tBTC unwrapped</BodyXs>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem
                  status={
                    isProcessCompleted || shouldForceIsProcessCompleted
                      ? "active"
                      : isRedemptionRequested
                      ? "semi-active"
                      : "inactive"
                  }
                >
                  <TimelineBreakpoint>
                    <TimelineDot position="relative">
                      {(isProcessCompleted ||
                        shouldForceIsProcessCompleted) && (
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
      )}
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
            {!(shouldDisplaySuccessStep || shouldForceIsProcessCompleted) && (
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
          amount={requestedAmount}
          suffixItem="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsAmountItem
          label="Received Amount"
          amount={receivedAmount}
          suffixItem="BTC"
          tokenDecimals={8}
          precision={6}
          higherPrecision={8}
          withHigherPrecision
        />
        <TransactionDetailsAmountItem
          label="Threshold Network Fee"
          amount={thresholdNetworkFee}
          suffixItem="tBTC"
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
