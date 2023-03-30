import { FC, useEffect } from "react"
import {
  BodyLg,
  BodyMd,
  BodySm,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Skeleton,
  Box,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { ONE_SEC_IN_MILISECONDS } from "../../../../utils/date"
import {
  BTCConfirmationsIcon,
  GuardianCheckIcon,
  MintingCompletedIcon,
  MintingInitializedIcon,
} from "./DepositDetailsStepIcons"

type StepTemplateProps = {
  title: string
  subtitle: string | JSX.Element
  txHash?: string
  chain: ViewInBlockExplorerChain
  progressBarColor: string
  progressBarLabel?: string | JSX.Element
  isCompleted: boolean
  onComplete: () => void
  isIndeterminate?: boolean
  progressBarValue?: number
  progressBarMaxValue?: number
  icon: JSX.Element
}

export const StepTemplate: FC<StepTemplateProps> = ({
  title,
  subtitle,
  txHash,
  chain,
  progressBarLabel,
  progressBarValue,
  progressBarMaxValue,
  progressBarColor,
  isIndeterminate,
  isCompleted,
  onComplete,
  icon,
}) => {
  useEffect(() => {
    if (!isCompleted) return

    const timeout = setTimeout(onComplete, 10 * ONE_SEC_IN_MILISECONDS)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCompleted, onComplete])

  return (
    <Flex flexDirection="column" alignItems="center" height="100%">
      <BodyLg
        color="gray.700"
        mt="8"
        alignSelf="flex-start"
        fontSize="20px"
        lineHeight="24px"
      >
        {title}
      </BodyLg>

      <CircularProgress
        alignSelf="center"
        mt="6"
        value={isCompleted ? 100 : progressBarValue}
        max={isCompleted ? undefined : progressBarMaxValue}
        color={progressBarColor}
        trackColor="gray.100"
        size="160px"
        thickness="8px"
        isIndeterminate={isCompleted ? undefined : isIndeterminate}
      >
        {isCompleted && (
          <CircularProgressLabel __css={{ svg: { margin: "auto" } }}>
            {icon}
          </CircularProgressLabel>
        )}
      </CircularProgress>
      {progressBarLabel}
      <BodyMd as={Box} mt="6" px="3.5" alignSelf="flex-start">
        {subtitle}
      </BodyMd>
      {txHash && (
        <BodySm mt="auto" mb="8" color="gray.500" textAlign="center">
          See transaction on{" "}
          <ViewInBlockExplorer
            text={chain === "bitcoin" ? "blockstream" : "etherscan"}
            chain={chain}
            id={txHash}
            type={ExplorerDataType.TRANSACTION}
          />
        </BodySm>
      )}
    </Flex>
  )
}

const BitcoinConfirmationsSummary: FC<{
  minConfirmationsNeeded?: number
  txConfirmations?: number
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
        <Skeleton
          as="span"
          isLoaded={areConfirmationsLoaded}
          display="inline-block"
        >
          {txConfirmations! > minConfirmationsNeeded!
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

type CommonStepProps = Pick<StepTemplateProps, "onComplete"> & {
  txHash?: string
}

export const Step1: FC<
  { confirmations?: number; requiredConfirmations?: number } & Pick<
    StepTemplateProps,
    "txHash" | "onComplete"
  >
> = ({ confirmations, requiredConfirmations, txHash, onComplete }) => {
  const subtitle = `Your Bitcoin deposit transaction requires ${requiredConfirmations} confirmation${
    requiredConfirmations !== undefined && requiredConfirmations > 1 ? "s" : ""
  } on the Bitcoin Network before initiating the minting process.`

  return (
    <StepTemplate
      title="Waiting for the Bitcoin Network Confirmations..."
      subtitle={subtitle}
      chain="bitcoin"
      txHash={txHash}
      icon={<BTCConfirmationsIcon />}
      progressBarColor="brand.500"
      progressBarValue={confirmations}
      progressBarMaxValue={requiredConfirmations}
      progressBarLabel={
        <BitcoinConfirmationsSummary
          minConfirmationsNeeded={requiredConfirmations}
          txConfirmations={confirmations}
        />
      }
      isCompleted={Boolean(
        confirmations &&
          requiredConfirmations &&
          confirmations >= requiredConfirmations
      )}
      onComplete={onComplete}
    />
  )
}

export const Step2: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <StepTemplate
      title="Minting Initialized"
      subtitle={
        <>
          <BodyMd mb="9">
            A Minter is assessing the minting initialization.If all is well, the
            Minter will transfer the initialization to the Guardian.
          </BodyMd>
          <BodyMd>
            Minters are a small group of experts who monitor BTC deposits on the
            chain.
          </BodyMd>
        </>
      }
      icon={<MintingInitializedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="yellow.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    />
  )
}

export const Step3: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <StepTemplate
      title="Guardian Check"
      subtitle={
        <>
          <BodyMd mb="9">
            A Guardian examines the minting request submitted by a Minter. If
            all is well, the contract proceeds to the minting stage.
          </BodyMd>
          <BodyMd>
            Guardians verify minting requests and cancel fraudulent mints and
            remove problematic minters.
          </BodyMd>
        </>
      }
      icon={<GuardianCheckIcon />}
      chain="ethereum"
      progressBarColor="green.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    />
  )
}

export const Step4: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <StepTemplate
      title="Minting in progress"
      subtitle="The contract is minting your tBTC tokens."
      icon={<MintingCompletedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="teal.500"
      isCompleted={true}
      onComplete={onComplete}
      isIndeterminate
    />
  )
}
