import { FC, ReactNode } from "react"
import {
  LabelSm,
  BodySm,
  Box,
  BoxProps,
  UnorderedList,
} from "@threshold-network/components"
import { IoCheckmarkSharp as CompleteIcon } from "react-icons/all"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import Link from "../../../../components/Link"
import { ExternalHref } from "../../../../enums"

type MintingTimelineItemBaseProps = {
  isActive: boolean
  isComplete: boolean
  stepNumber: number
  label: string
  description: ReactNode
}

type MintingTimelineItemProps = Omit<
  MintingTimelineItemBaseProps,
  "description" | "stepNumber" | "label"
> &
  BoxProps

const MintingTimelineItem: FC<MintingTimelineItemBaseProps> = (props) => {
  const { isActive, isComplete, label, description, stepNumber, ...restProps } =
    props

  return (
    <Box
      as="li"
      sx={{
        position: "relative",
        borderLeft: "2px solid",
        ml: "2.5",
        pl: "5",
        pb: "8",
        borderColor: "gray.300",
        "&:last-of-type": {
          pb: "0",
          borderColor: "transparent",
        },
        "&:not(:nth-last-of-type(-n+2))": {
          borderColor: isComplete ? "green.400" : "gray.300",
        },
      }}
      {...restProps}
    >
      <LabelSm
        sx={{
          position: "absolute",
          left: "0",
          transform: "translateX(calc(-50% - 1px))",
          rounded: "full",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          w: "6",
          h: "6",
          border: "2px solid",
          borderColor: isComplete ? "green.400" : "gray.300",
          color: isComplete ? "white" : "brand.500",
          bg: isComplete ? "green.400" : "white",
        }}
      >
        {isComplete ? <CompleteIcon /> : stepNumber}
      </LabelSm>
      <LabelSm sx={{ lineHeight: "6", pb: isActive ? "3" : "0" }}>
        {label}
      </LabelSm>
      {isActive && <BodySm>{description}</BodySm>}
    </Box>
  )
}

export const MintingTimelineStep1: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={1}
      label="Deposit Address"
      description={
        <>
          Provide an ETH address and a BTC Return address to generate an unique
          BTC deposit address. <br />
          <Link isExternal href={ExternalHref.btcRecoveryAddress}>
            Read more
          </Link>
        </>
      }
      {...restProps}
    />
  )
}

export const MintingTimelineStep2: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={2}
      label="Make a BTC deposit"
      description="Send any amount lager than 0.01 BTC to this unique BTC Deposit Address. The amount sent will be used to mint tBTC."
      {...restProps}
    />
  )
}

export const MintingTimelineStep3: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      // we never render the complete state for this step
      isComplete={isComplete}
      stepNumber={3}
      label="Initiate minting"
      description="Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours."
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
      <LabelSm mb="4">Timeline</LabelSm>
      <UnorderedList ml="-2.5" listStyleType="none">
        <MintingTimelineStep1
          isActive={_mintingStep === MintingStep.ProvideData}
          isComplete={
            _mintingStep === MintingStep.Deposit ||
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
        />
        <MintingTimelineStep2
          isActive={_mintingStep === MintingStep.Deposit}
          isComplete={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
        />
        <MintingTimelineStep3
          isActive={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          // we never render the complete state for this step
          isComplete={false}
        />
      </UnorderedList>
    </Box>
  )
}
