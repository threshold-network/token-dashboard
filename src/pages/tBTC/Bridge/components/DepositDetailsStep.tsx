import { FC } from "react"
import {
  BodyMd,
  BodySm,
  HStack,
  Skeleton,
  Box,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import {
  BTCConfirmationsIcon,
  GuardianCheckIcon,
  MintingCompletedIcon,
  MintingInitializedIcon,
} from "./DepositDetailsStepIcons"
import { BridgeProcessStepProps, BridgeProcessStep } from "./BridgeProcessStep"

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

type CommonStepProps = Pick<BridgeProcessStepProps, "onComplete"> & {
  txHash?: string
}

export const Step1: FC<
  { confirmations?: number; requiredConfirmations?: number } & Pick<
    BridgeProcessStepProps,
    "txHash" | "onComplete"
  >
> = ({ confirmations, requiredConfirmations, txHash, onComplete }) => {
  const subtitle = `Your Bitcoin deposit transaction requires ${requiredConfirmations} confirmation${
    requiredConfirmations !== undefined && requiredConfirmations > 1 ? "s" : ""
  } on the Bitcoin Network before initiating the minting process.`

  return (
    <BridgeProcessStep
      title="Waiting for the Bitcoin Network Confirmations..."
      chain="bitcoin"
      txHash={txHash}
      icon={<BTCConfirmationsIcon />}
      progressBarColor="brand.500"
      progressBarValue={confirmations}
      progressBarMaxValue={requiredConfirmations}
      isCompleted={Boolean(
        confirmations &&
          requiredConfirmations &&
          confirmations >= requiredConfirmations
      )}
      onComplete={onComplete}
    >
      <BitcoinConfirmationsSummary
        minConfirmationsNeeded={requiredConfirmations}
        txConfirmations={confirmations}
      />
      <BodyMd mt="6" px="3.5" alignSelf="flex-start">
        {subtitle}
      </BodyMd>
    </BridgeProcessStep>
  )
}

export const Step2: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Minting Initialized"
      icon={<MintingInitializedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="yellow.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    >
      <Box mt="6" px="3.5" alignSelf="flex-start">
        <BodyMd mb="9">
          A Minter is assessing the minting initialization. If all is well, the
          Minter will transfer the initialization to the Guardian.
        </BodyMd>
        <BodyMd>
          Minters are a small group of experts who monitor BTC deposits on the
          chain.
        </BodyMd>
      </Box>
    </BridgeProcessStep>
  )
}

export const Step3: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Guardian Check"
      icon={<GuardianCheckIcon />}
      chain="ethereum"
      progressBarColor="green.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    >
      <Box mt="6" px="3.5" alignSelf="flex-start">
        <BodyMd mb="9">
          A Guardian examines the minting request submitted by a Minter. If all
          is well, the contract proceeds to the minting stage.
        </BodyMd>
        <BodyMd>
          Guardians verify minting requests and cancel fraudulent mints and
          remove problematic minters.
        </BodyMd>
      </Box>
    </BridgeProcessStep>
  )
}

export const Step4: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Minting in progress"
      icon={<MintingCompletedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="teal.500"
      isCompleted={true}
      onComplete={onComplete}
      isIndeterminate
    >
      <BodyMd mt="6" px="3.5" alignSelf="flex-start">
        The contract is minting your tBTC tokens.
      </BodyMd>
    </BridgeProcessStep>
  )
}
