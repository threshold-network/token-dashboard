import { FC, useMemo } from "react"
import { useParams } from "react-router"
import { PageComponent } from "../../../types"
import { useAppDispatch } from "../../../hooks/store"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./components/TbtcMintingCardTitle"
import {
  Badge,
  BodyLg,
  BodyMd,
  BodySm,
  Box,
  Card,
  CircularProgress,
  Flex,
  HStack,
  LabelSm,
  List,
  ListItem,
  Skeleton,
  Stack,
  StackDivider,
  Icon,
  Image,
  H6,
} from "@threshold-network/components"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import {
  Timeline,
  TimelineBreakpoint,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineItemStatus,
} from "../../../components/Timeline"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { IoTime as TimeIcon } from "react-icons/all"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import codeSlashIllustration from "../../../static/images/code-slash.svg"
import Link from "../../../components/Link"

type DepositDetailsTimelineStep =
  | "bitcoin-confirmations"
  | "minting-initialized"
  | "guardian-check"
  | "minting-completed"

type DepositDetailsTimelineItem = {
  id: DepositDetailsTimelineStep
  text: string
  status: TimelineItemStatus
}

const depositTimelineItems: DepositDetailsTimelineItem[] = [
  {
    id: "bitcoin-confirmations",
    text: "Bitcoin Checkpoint",
    status: "semi-active",
  },
  {
    id: "minting-initialized",
    text: "Minting Initialized",
    status: "inactive",
  },
  {
    id: "guardian-check",
    text: "Guardian Check",
    status: "inactive",
  },
  {
    id: "minting-completed",
    text: "Minting Completed",
    status: "inactive",
  },
]
type DepositDetailsTimelineProps =
  | {
      isCompleted?: never
      inProgressStep: DepositDetailsTimelineStep
    }
  | {
      inProgressStep?: never
      isCompleted: true
    }

const DepositDetailsTimeline: FC<DepositDetailsTimelineProps> = ({
  inProgressStep,
  isCompleted,
}) => {
  const items = useMemo<DepositDetailsTimelineItem[]>(() => {
    const inProgressItemIndex = depositTimelineItems.findIndex(
      (item) => item.id === inProgressStep
    )
    return depositTimelineItems.map((item, index) => {
      let status: TimelineItemStatus = "active"
      if (isCompleted) return { ...item, status }
      if (index === inProgressItemIndex) {
        status = "semi-active"
      } else if (index > inProgressItemIndex) {
        status = "inactive"
      }

      return { ...item, status }
    })
  }, [inProgressStep])

  return (
    <Timeline>
      {items.map((item) => (
        <TimelineItem key={item.id} status={item.status}>
          <TimelineBreakpoint>
            <TimelineDot />
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>{item.text}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

type StepTemplateCommonProps = {
  title: string
  subtitle: string
  txHash: string
  chain: ViewInBlockExplorerChain
  progressBarColor: string
  progressBarLabel?: string | JSX.Element
}
type StepTemplateConditionalProps =
  | {
      isIndeterminate: true
      progressBarValue: never
      progressBarMaxValue: never
    }
  | {
      isIndeterminate?: false
      progressBarValue: number
      progressBarMaxValue: number
    }

type StepTemplateProps = StepTemplateCommonProps & StepTemplateConditionalProps

const StepTemplate: FC<StepTemplateProps> = ({
  title,
  subtitle,
  txHash,
  chain,
  progressBarLabel,
  progressBarValue,
  progressBarMaxValue,
  progressBarColor,
  isIndeterminate,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <BodyLg color="gray.700" mt="8" alignSelf="flex-start">
        {title}
      </BodyLg>

      <CircularProgress
        alignSelf="center"
        mt="6"
        value={progressBarValue}
        color={progressBarColor}
        trackColor="gray.100"
        max={progressBarMaxValue}
        size="160px"
        thickness="8px"
        isIndeterminate={isIndeterminate}
      />
      {progressBarLabel}
      <BodyMd textAlign="center" mt="6" px="6">
        {subtitle}
      </BodyMd>
      <BodySm mt="9" color="gray.500" textAlign="center">
        See transaction on{" "}
        <ViewInBlockExplorer
          text={chain === "bitcoin" ? "blockstream" : "etherscan"}
          chain={chain}
          id={txHash}
          type={ExplorerDataType.TRANSACTION}
        />
      </BodySm>
    </Flex>
  )
}

const BitcoinConfirmationsSummary: FC<{
  minConfirmationsNeeded: number
  txConfirmations: number
}> = ({ minConfirmationsNeeded, txConfirmations }) => {
  const areConfirmationsLoaded = txConfirmations !== undefined
  const checkmarkColor =
    txConfirmations &&
    minConfirmationsNeeded &&
    txConfirmations >= minConfirmationsNeeded
      ? "brand.500"
      : "gray.500"
  return (
    <HStack mt={8}>
      <CheckCircleIcon w={4} h={4} color={checkmarkColor} />{" "}
      <BodySm color={"gray.500"}>
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
  )
}

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  console.log("desposit key", depositKey)

  const dispatch = useAppDispatch()
  const threshold = useThreshold()
  const {
    tBTCMintAmount,
    utxo,
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
  const txConfirmations = 3

  return (
    <Card>
      <Stack
        direction={{
          base: "column",
          xl: "row",
        }}
        divider={<StackDivider />}
        h="100%"
        spacing={4}
      >
        <Box>
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
          <DepositDetailsTimeline
            // isCompleted
            inProgressStep="bitcoin-confirmations"
          />
          <StepTemplate
            title="Waiting for the Bitcoin Network Confirmations..."
            subtitle="The Bitcoin Deposit transaction needs to get 6 confirmations on the Bitcoin Network before the minting is initialised."
            chain="bitcoin"
            txHash={btcDepositTxHash}
            progressBarColor="brand.500"
            progressBarValue={3}
            progressBarMaxValue={6}
            progressBarLabel={
              <BitcoinConfirmationsSummary
                minConfirmationsNeeded={minConfirmationsNeeded}
                txConfirmations={txConfirmations}
              />
            }
          />
        </Box>
        <Flex maxW="33%" direction="column">
          <LabelSm mb="8">Transaction History</LabelSm>
          <Badge
            size="sm"
            colorScheme="yellow"
            variant="solid"
            display="flex"
            alignItems="center"
            mb="4"
          >
            <Icon as={TimeIcon} /> ~3 hours minting time
          </Badge>
          <List color="gray.500">
            <ListItem>Bitcoin Deposit transaction</ListItem>
            <ListItem>Reveal transaction</ListItem>
          </List>
          <Box bg="yellow.50" p="4" mt="auto">
            <Image src={codeSlashIllustration} mx="auto" />
          </Box>
          <H6 mt="4" color="gray.800">
            6/6 Bitcoin Confirmations Requirement
          </H6>
          <BodySm mt="1" color="gray.500">
            Amazing body copy of the new update, feature, code or design
            improvement.{" "}
            <Link isExternal href="TODO">
              Read more
            </Link>
          </BodySm>
        </Flex>
      </Stack>
    </Card>
  )
}

DepositDetails.route = {
  path: "deposit/:depositKey",
  index: false,
  isPageEnabled: true,
}
