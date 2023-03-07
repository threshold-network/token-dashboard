import { useParams } from "react-router"
import { PageComponent } from "../../../types"
import { useAppDispatch } from "../../../hooks/store"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./components/TbtcMintingCardTitle"
import {
  BodyLg,
  BodyMd,
  BodySm,
  Box,
  Card,
  CircularProgress,
  Flex,
  HStack,
  Skeleton,
} from "@threshold-network/components"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import {
  Timeline,
  TimelineBreakpoint,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
} from "../../../components/Timeline"
import { CheckCircleIcon } from "@chakra-ui/icons"
import ViewInBlockExplorer from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  console.log("desposit key", depositKey)

  const dispatch = useAppDispatch()
  const threshold = useThreshold()
  const {
    tBTCMintAmount,
    utxo,
    txConfirmations,
    depositRevealedTxHash,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
  } = useTbtcState()
  const amount = "1335600000000000000"

  const btcDepositTxHash = "0x0" // utxo.transactionHash.toString()
  // const tbtcTokenAddress = useTBTCTokenAddress()

  // const onDismissButtonClick = () => {
  //   onPreviousStepClick(MintingStep.ProvideData)
  // }

  // const transactionHash = utxo.transactionHash.toString()
  // const value = utxo.value.toString()

  // useEffect(() => {
  //   dispatch(
  //     tbtcSlice.actions.fetchUtxoConfirmations({
  //       utxo: { transactionHash, value },
  //     })
  //   )
  // }, [dispatch, transactionHash, value])

  const minConfirmationsNeeded = 6
  // threshold.tbtc.minimumNumberOfConfirmationsNeeded(utxo.value)

  const areConfirmationsLoaded = true // txConfirmations !== undefined

  const checkmarkColor =
    txConfirmations &&
    minConfirmationsNeeded &&
    txConfirmations >= minConfirmationsNeeded
      ? "brand.500"
      : "gray.500"

  return (
    <Card>
      <TbtcMintingCardTitle />
      <Flex mb="4">
        <BodyLg>
          <Box as="span" fontWeight="600" color="brand.500">
            Minting{" "}
          </Box>
          - In progress...
        </BodyLg>{" "}
        <InlineTokenBalance
          tokenAmount={amount}
          tokenSymbol="tBTC"
          withSymbol
          ml="auto"
        />
      </Flex>
      <Timeline>
        <TimelineItem status="active">
          <TimelineBreakpoint>
            <TimelineDot />
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>Bitcoin checkpoint</TimelineContent>
        </TimelineItem>

        <TimelineItem status="active">
          <TimelineBreakpoint>
            <TimelineDot />
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>Minting initialized</TimelineContent>
        </TimelineItem>

        <TimelineItem status="semi-active">
          <TimelineBreakpoint>
            <TimelineDot />
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>Guardian Check</TimelineContent>
        </TimelineItem>

        <TimelineItem status="inactive">
          <TimelineBreakpoint>
            <TimelineDot />
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>Minting Completed</TimelineContent>
        </TimelineItem>
      </Timeline>
      <Flex flexDirection="column" alignItems="center">
        <BodyLg color="gray.700" mt="8">
          Waiting for the Bitcoin Network Confirmations...
        </BodyLg>

        <CircularProgress
          alignSelf="center"
          mt="6"
          value={3}
          color="brand.500"
          trackColor="gray.100"
          max={minConfirmationsNeeded}
          size="160px"
          thickness="8px"
        />
        <HStack mt="6">
          <CheckCircleIcon w={4} h={4} color={checkmarkColor} />{" "}
          <BodySm as="div" color={"gray.500"}>
            <Skeleton isLoaded={areConfirmationsLoaded} display="inline-block">
              {txConfirmations > minConfirmationsNeeded
                ? minConfirmationsNeeded
                : txConfirmations}
              {"/"}
              {minConfirmationsNeeded}
            </Skeleton>
            {"  Bitcoin Network Confirmations"}
          </BodySm>
        </HStack>
      </Flex>

      <BodyMd textAlign="center" mt="6" px="6">
        The Bitcoin Deposit transaction needs to get 6 confirmations on the
        Bitcoin Network before the minting is initialised.
      </BodyMd>
      <BodySm mt="9" color="gray.500" textAlign="center">
        See transaction on{" "}
        <ViewInBlockExplorer
          text="blockstream"
          chain="bitcoin"
          id={btcDepositTxHash}
          type={ExplorerDataType.TRANSACTION}
        />
      </BodySm>
    </Card>
  )
}

DepositDetails.route = {
  path: "deposit/:depositKey",
  index: false,
  isPageEnabled: true,
}
