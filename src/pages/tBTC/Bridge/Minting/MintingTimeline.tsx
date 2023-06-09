import { FC } from "react"
import {
  LabelSm,
  Box,
  Badge,
  Icon,
  BoxProps,
} from "@threshold-network/components"
import { IoTime as TimeIcon } from "react-icons/all"
import TimelineItem, { TimelineProps } from "../components/TimelineItem"
import tbtcMintingStep1 from "../../../../static/images/tbtcMintingStep1.svg"
import tbtcMintingStep2 from "../../../../static/images/minting-step-2.svg"
import tbtcMintingStep3 from "../../../../static/images/minting-step-3.svg"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import Link from "../../../../components/Link"
import { ExternalHref } from "../../../../enums"
import { Steps } from "../../../../components/Step"

type MintingTimelineStepProps = Omit<
  TimelineProps,
  "stepText" | "helperLabelText" | "title" | "description" | "imageSrc"
>

export const MintingTimelineStep1: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <TimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepText="Step 1"
      helperLabelText="ACTION OFF-CHAIN"
      title="Deposit Address"
      description={
        <>
          Provide an ETH address and a BTC Recovery address to generate an
          unique BTC deposit address.{" "}
          <Link isExternal href={ExternalHref.btcRecoveryAddress}>
            Read more
          </Link>
          .
        </>
      }
      imageSrc={tbtcMintingStep1}
      {...restProps}
    />
  )
}

export const MintingTimelineStep2: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <TimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepText="Step 2"
      helperLabelText="ACTION ON BITCOIN"
      title="Make a BTC deposit"
      description="Send any amount lager than 0.01 BTC to this unique BTC Deposit Address. The amount sent will be used to mint tBTC."
      imageSrc={tbtcMintingStep2}
      {...restProps}
    />
  )
}

export const MintingTimelineStep3: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <TimelineItem
      isActive={isActive}
      // we never render the complete state for this step
      isComplete={isComplete}
      stepText="Step 3"
      helperLabelText="ACTION ON ETHEREUM"
      title="Initiate minting"
      description="Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours."
      imageSrc={tbtcMintingStep3}
      {...restProps}
    />
  )
}

type MintingTimelineProps = {
  mintingStep?: MintingStep
} & BoxProps

export const MintingTimeline: FC<MintingTimelineProps> = ({
  mintingStep: mintingStepFropProps,
  ...restProps
}) => {
  const { mintingStep: mintingStepFromState } = useTbtcState()
  const _mintingStep = mintingStepFropProps ?? mintingStepFromState

  return (
    <Box {...restProps}>
      <LabelSm mb={8}>Minting Timeline</LabelSm>
      <Steps>
        <MintingTimelineStep1
          isActive={_mintingStep === MintingStep.ProvideData}
          isComplete={
            _mintingStep === MintingStep.Deposit ||
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          mb="4"
        />
        <MintingTimelineStep2
          isActive={_mintingStep === MintingStep.Deposit}
          isComplete={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          withBadge
          mb="4"
        />
        <MintingTimelineStep3
          isActive={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          // we never render the complete state for this step
          isComplete={false}
          withBadge
          mb="4"
        />
      </Steps>
      <Badge size="sm" colorScheme="yellow" variant="solid">
        <Icon as={TimeIcon} alignSelf="center" /> ~3 hours minting time
      </Badge>
    </Box>
  )
}
