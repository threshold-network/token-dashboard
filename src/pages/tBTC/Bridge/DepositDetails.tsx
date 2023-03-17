import {
  FC,
  useState,
  useCallback,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react"
import { useParams } from "react-router"
import {
  Badge,
  BodyLg,
  BodyMd,
  Box,
  Card,
  Flex,
  HStack,
  LabelSm,
  List,
  ListItem,
  Skeleton,
  Stack,
  StackDivider,
  Icon,
  Divider,
  H5,
  SkeletonText,
  SkeletonCircle,
  Image,
} from "@threshold-network/components"
import { IoCheckmarkSharp, IoTime as TimeIcon } from "react-icons/all"
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
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import ButtonLink from "../../../components/ButtonLink"
import { TBTCTokenContractLink } from "../../../components/tBTC"
import { Step1, Step2, Step3, Step4 } from "./components/DepositDetailsStep"
import { TbtcMintingCardTitle } from "./components/TbtcMintingCardTitle"
import {
  MintingProcessResource,
  MintingProcessResourceProps,
} from "./components/MintingProcessResource"
import { useAppDispatch } from "../../../hooks/store"
import { useTbtcState } from "../../../hooks/useTbtcState"
import {
  useFetchDepositDetails,
  DepositData,
  useSubscribeToOptimisticMintingRequestedEventBase,
  useSubscribeToOptimisticMintingFinalizedEventBase,
} from "../../../hooks/tbtc"
import { tbtcSlice } from "../../../store/tbtc"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { PageComponent } from "../../../types"
import mainCardBackground from "../../../static/images/minting-completed-card-bg.png"
import { DotsLoadingIndicator } from "../../../components/DotsLoadingIndicator"
import tBTCIcon from "../../../static/images/tBTC.svg"
import BitcoinIcon from "../../../static/images/bitcoin.svg"
import { CurveFactoryPoolId, ExternalHref } from "../../../enums"
import { ExternalPool } from "../../../components/tBTC/ExternalPool"
import { useFetchExternalPoolData } from "../../../hooks/useFetchExternalPoolData"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  const dispatch = useAppDispatch()
  const { txConfirmations } = useTbtcState()
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)
  const tBTCWBTCSBTCPoolData = useFetchExternalPoolData(
    "curve",
    CurveFactoryPoolId.TBTC_WBTC_SBTC
  )
  const [inProgressStep, setInProgressStep] =
    useState<DepositDetailsTimelineStep>("bitcoin-confirmations")
  const { mintingRequestedTxHash, mintingFinalizedTxHash } =
    useSubscribeToOptimisticMintingEvents(depositKey)

  // Extract deposit details values to use them as a dependency in hook
  // dependency array.
  const btcDepositTxHash = data?.btcTxHash
  const amount = data?.amount ?? "0"
  const confirmations = data?.confirmations
  const requiredConfirmations = data?.requiredConfirmations
  const depositRevealedTxHash = data?.depositRevealedTxHash
  const optimisticMintingRequestedTxHash =
    data?.optimisticMintingRequestedTxHash
  const optimisticMintingFinalizedTxHash =
    data?.optimisticMintingFinalizedTxHash

  useEffect(() => {
    if (
      !!btcDepositTxHash &&
      confirmations !== undefined &&
      requiredConfirmations !== undefined &&
      confirmations < requiredConfirmations
    ) {
      dispatch(
        tbtcSlice.actions.fetchUtxoConfirmations({
          utxo: { transactionHash: btcDepositTxHash, value: amount },
        })
      )
    }
  }, [dispatch, btcDepositTxHash, amount, confirmations, requiredConfirmations])

  useEffect(() => {
    if (!confirmations || !requiredConfirmations) return

    setInProgressStep(
      getInProgressStep({
        confirmations,
        requiredConfirmations,
        optimisticMintingFinalizedTxHash,
        optimisticMintingRequestedTxHash,
      })
    )
  }, [
    confirmations,
    requiredConfirmations,
    optimisticMintingFinalizedTxHash,
    optimisticMintingRequestedTxHash,
  ])

  const transactions: {
    label: string
    txHash?: string
    chain: ViewInBlockExplorerChain
  }[] = [
    { label: "Bitcoin Deposit", txHash: btcDepositTxHash, chain: "bitcoin" },
    { label: "Reveal", txHash: depositRevealedTxHash, chain: "ethereum" },
    {
      label: "Minting Initiation",
      txHash: data?.optimisticMintingRequestedTxHash ?? mintingRequestedTxHash,
      chain: "ethereum",
    },
    {
      label: "Minting completion",
      txHash: data?.optimisticMintingFinalizedTxHash ?? mintingFinalizedTxHash,
      chain: "ethereum",
    },
  ]

  const mainCardProps =
    inProgressStep === "completed"
      ? {
          backgroundImage: mainCardBackground,
          backgroundPosition: "bottom -10px right",
          backgroundRepeat: "no-repeat",
        }
      : {}

  return (
    <DepositDetailsPageContext.Provider
      value={{
        step: inProgressStep,
        updateStep: setInProgressStep,
        btcTxHash: btcDepositTxHash,
        optimisticMintingRequestedTxHash:
          optimisticMintingRequestedTxHash ?? mintingRequestedTxHash,
        optimisticMintingFinalizedTxHash:
          optimisticMintingFinalizedTxHash ?? mintingFinalizedTxHash,
        confirmations: confirmations || txConfirmations,
        requiredConfirmations: requiredConfirmations!,
      }}
    >
      <Card {...mainCardProps}>
        {(isFetching || !data) && !error && <DepositDetailsPageSkeleton />}
        {error && <>{error}</>}
        {!isFetching && !!data && !error && (
          <>
            <Stack
              direction={{
                base: "column",
                xl: "row",
              }}
              divider={<StackDivider />}
              h="100%"
              spacing={4}
            >
              <Box mb="8" w={{ base: "100%", xl: "65%" }}>
                <TbtcMintingCardTitle />
                <Flex mb="4">
                  <BodyLg>
                    <Box as="span" fontWeight="600" color="brand.500">
                      {inProgressStep === "completed" ? "Minted" : "Minting"}
                    </Box>
                    {inProgressStep !== "completed" && ` - In progress...`}
                  </BodyLg>{" "}
                  <InlineTokenBalance
                    tokenAmount={amount || "0"}
                    tokenDecimals={8}
                    tokenSymbol="tBTC"
                    withSymbol
                    ml="auto"
                  />
                </Flex>
                <DepositDetailsTimeline
                  // isCompleted
                  inProgressStep={inProgressStep}
                />
                <StepSwitcher />
              </Box>
              <Flex
                w={{ base: "100%", xl: "35%" }}
                mb={{ base: "20", xl: "unset" }}
                direction="column"
              >
                <LabelSm mb="8">Transaction History</LabelSm>
                <Badge
                  size="sm"
                  colorScheme="yellow"
                  variant="solid"
                  display="flex"
                  alignItems="center"
                  alignSelf="flex-start"
                  mb="4"
                >
                  <Icon as={TimeIcon} /> ~3 hours minting time
                </Badge>
                <List color="gray.500" spacing="2" mb="20">
                  {transactions
                    .filter((item) => !!item.txHash)
                    .map((item) => (
                      <ListItem key={item.txHash}>
                        {item.label}{" "}
                        <ViewInBlockExplorer
                          id={item.txHash!}
                          type={ExplorerDataType.TRANSACTION}
                          chain={item.chain}
                          text="transaction"
                        />
                        .
                      </ListItem>
                    ))}
                </List>
                {inProgressStep !== "completed" && (
                  <>
                    <HStack spacing="4" mt="auto" mb="10" alignSelf="center">
                      <Image src={BitcoinIcon} />
                      <DotsLoadingIndicator />
                      <Image src={tBTCIcon} />
                    </HStack>
                    <MintingProcessResource
                      {...stepToResourceData[inProgressStep]}
                    />
                  </>
                )}
              </Flex>
            </Stack>
            {inProgressStep !== "completed" && (
              <>
                <Divider />
                <HStack mt="8" spacing="16" alignItems="center">
                  <BodyLg>
                    Eager to start a new mint while waiting for this one? You
                    can now.
                  </BodyLg>
                  <ButtonLink size="lg" to="/tBTC/mint">
                    New Mint
                  </ButtonLink>
                </HStack>
              </>
            )}
          </>
        )}
      </Card>
      {inProgressStep === "completed" && (
        <ExternalPool
          title={"tBTC Curve Pool"}
          externalPoolData={{ ...tBTCWBTCSBTCPoolData }}
          mt={4}
        />
      )}
    </DepositDetailsPageContext.Provider>
  )
}

DepositDetails.route = {
  path: "deposit/:depositKey",
  index: false,
  isPageEnabled: true,
}

const DepositDetailsPageContext = createContext<
  | (Pick<
      DepositData,
      "optimisticMintingRequestedTxHash" | "optimisticMintingFinalizedTxHash"
    > & {
      btcTxHash?: string
      confirmations?: number
      requiredConfirmations?: number
      updateStep: (step: DepositDetailsTimelineStep) => void
      step: DepositDetailsTimelineStep
    })
  | undefined
>(undefined)

const useDepositDetailsPageContext = () => {
  const context = useContext(DepositDetailsPageContext)

  if (!context) {
    throw new Error(
      "DepositDetailsPageContext used outside of the DepositDetailsPage component."
    )
  }
  return context
}

const DepositDetailsPageSkeleton: FC = () => {
  return (
    <>
      <SkeletonText noOfLines={1} skeletonHeight={6} />

      <Skeleton height="80px" mt="4" />

      <SkeletonText noOfLines={1} width="40%" skeletonHeight={6} mt="8" />
      <SkeletonCircle mt="4" size="160px" mx="auto" />
      <SkeletonText mt="4" noOfLines={4} spacing={2} skeletonHeight={4} />
    </>
  )
}

type DepositDetailsTimelineStep =
  | "bitcoin-confirmations"
  | "minting-initialized"
  | "guardian-check"
  | "minting-completed"
  | "completed"

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
type DepositDetailsTimelineProps = {
  inProgressStep: DepositDetailsTimelineStep
}

const DepositDetailsTimeline: FC<DepositDetailsTimelineProps> = ({
  inProgressStep,
}) => {
  const items = useMemo<DepositDetailsTimelineItem[]>(() => {
    const isCompleted = inProgressStep === "completed"
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
            <TimelineDot position="relative">
              {item.status === "active" && (
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
          <TimelineContent>{item.text}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

const getInProgressStep = (
  depositDetails?: Omit<
    DepositData,
    "depositRevealedTxHash" | "btcTxHash" | "amount"
  >
): DepositDetailsTimelineStep => {
  if (!depositDetails) return "bitcoin-confirmations"

  const {
    confirmations,
    requiredConfirmations,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
  } = depositDetails

  if (optimisticMintingFinalizedTxHash) return "completed"

  if (optimisticMintingRequestedTxHash) return "guardian-check"

  if (confirmations >= requiredConfirmations) return "minting-initialized"

  return "bitcoin-confirmations"
}

const stepToNextStep: Record<
  Exclude<DepositDetailsTimelineStep, "completed">,
  DepositDetailsTimelineStep
> = {
  "bitcoin-confirmations": "minting-initialized",
  "minting-initialized": "guardian-check",
  "guardian-check": "minting-completed",
  "minting-completed": "completed",
}

const StepSwitcher: FC = () => {
  const {
    step,
    confirmations,
    requiredConfirmations,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
    btcTxHash,
    updateStep,
  } = useDepositDetailsPageContext()

  const onComplete = useCallback(() => {
    if (step === "completed") return

    updateStep(stepToNextStep[step])
  }, [step])

  switch (step) {
    default:
    case "bitcoin-confirmations":
      return (
        <Step1
          txHash={btcTxHash}
          confirmations={confirmations}
          requiredConfirmations={requiredConfirmations}
          onComplete={onComplete}
        />
      )
    case "minting-initialized":
      return (
        <Step2
          txHash={optimisticMintingRequestedTxHash}
          onComplete={onComplete}
        />
      )
    case "guardian-check":
      return (
        <Step3
          txHash={optimisticMintingFinalizedTxHash}
          onComplete={onComplete}
        />
      )
    case "minting-completed":
      return (
        <Step4
          txHash={optimisticMintingFinalizedTxHash}
          onComplete={onComplete}
        />
      )
    case "completed":
      return (
        <>
          <H5 mt="10">Success!</H5>
          <BodyMd mt="8">
            Add the tBTC <TBTCTokenContractLink /> to your Ethereum wallet.
          </BodyMd>
          <ButtonLink size="lg" mt="12" to="/tBTC" isFullWidth>
            New mint
          </ButtonLink>
        </>
      )
  }
}

const useSubscribeToOptimisticMintingEvents = (depositKey?: string) => {
  const [mintingRequestedTxHash, setMintingRequestedTxHash] = useState("")
  const [mintingFinalizedTxHash, setMintingFinalizedTxHashTxHash] = useState("")

  useSubscribeToOptimisticMintingRequestedEventBase(
    (
      minter,
      depositKeyEventParam,
      depositor,
      amount,
      fundingTxHash,
      fundingOutputIndex,
      event
    ) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        setMintingRequestedTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (minter, depositKeyEventParam, depositor, optimisticMintingDebt, event) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        setMintingFinalizedTxHashTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  return { mintingRequestedTxHash, mintingFinalizedTxHash }
}

const stepToResourceData: Record<
  Exclude<DepositDetailsTimelineStep, "completed">,
  MintingProcessResourceProps
> = {
  "bitcoin-confirmations": {
    title: "Bitcoin Confirmations Requirement",
    subtitle:
      "Confirmations typically ensure transaction validity and finality.",
    link: ExternalHref.btcConfirmations,
  },
  "minting-initialized": {
    title: "Minters, Guardians and a secure tBTC",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "guardian-check": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "minting-completed": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
}
