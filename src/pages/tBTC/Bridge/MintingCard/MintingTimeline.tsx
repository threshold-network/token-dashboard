import { FC } from "react"
import { LabelSm, Box, Badge, Icon } from "@threshold-network/components"
import { IoTime as TimeIcon } from "react-icons/all"
import TimelineItem, { TimelineProps } from "../components/TimelineItem"
import tbtcMintingStep1 from "../../../../static/images/tbtcMintingStep1.svg"
import tbtcMintingStep2 from "../../../../static/images/minting-step-2.svg"
import tbtcMintingStep3 from "../../../../static/images/minting-step-3.svg"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import Link from "../../../../components/Link"
import { ExternalHref } from "../../../../enums"

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
      helperLabelText="OFF-CHAIN ACTION"
      title="Provide Data"
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
      helperLabelText="ACTION ON BITCOIN NETWORK"
      title="Make a BTC deposit"
      // TODO: Make sure this copy is a final one and can be the same on the How
      // it Works page and minting timeline in deposit flow.
      description="Send minimum 0.01&nbsp;BTC to this unique BTC Deposit Address. The amount sent will be used to mint tBTC."
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
      helperLabelText="ACTION ON ETHEREUM NETWORK"
      title="Initiate minting"
      description="Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours."
      imageSrc={tbtcMintingStep3}
      {...restProps}
    />
  )
}

export const MintingTimeline: FC = () => {
  const { mintingStep } = useTbtcState()
  return (
    <Box>
      <LabelSm mb={8}>Minting Timeline</LabelSm>
      <MintingTimelineStep1
        isActive={mintingStep === MintingStep.ProvideData}
        isComplete={
          mintingStep === MintingStep.Deposit ||
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        mb="4"
      />
      <Badge size="sm" variant="subtle" mb="4">
        action on bitcoin network
      </Badge>
      <MintingTimelineStep2
        isActive={mintingStep === MintingStep.Deposit}
        isComplete={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        withBadge={false}
        mb="4"
      />
      <Badge size="sm" variant="subtle" mb="4">
        action on ethereum network
      </Badge>
      <MintingTimelineStep3
        isActive={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        // we never render the complete state for this step
        isComplete={false}
        withBadge={false}
        mb="4"
      />
      <Badge size="sm" colorScheme="yellow" variant="solid">
        <Icon as={TimeIcon} alignSelf="center" /> ~1-3 hours minting time
      </Badge>
    </Box>
  )
}
