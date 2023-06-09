import { FC } from "react"
import { HiArrowNarrowLeft } from "react-icons/all"
import { Icon, Stack, LabelSm } from "@threshold-network/components"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { BridgeProcess, MintingStep } from "../../../../types/tbtc"
import { TBTCText } from "../../../../components/tBTC"

const bridgeProcessToText: Record<BridgeProcess, string> = {
  mint: "minting process",
  unmint: "unminting process",
}

type CommonProps = {
  bridgeProcess?: BridgeProcess
}

type ConditionalProps =
  | {
      previousStep?: MintingStep
      onPreviousStepClick: (previosuStep: MintingStep) => void
    }
  | {
      previousStep?: never
      onPreviousStepClick?: never
    }

type Props = CommonProps & ConditionalProps

export const BridgeProcessCardTitle: FC<Props> = ({
  previousStep,
  onPreviousStepClick,
  bridgeProcess = "mint",
}) => {
  return (
    <Stack direction="row" mb={8} align={"center"}>
      {previousStep && (
        <Icon
          cursor="pointer"
          onClick={() => onPreviousStepClick(previousStep)}
          mt="4px"
          as={HiArrowNarrowLeft}
        />
      )}
      <Icon boxSize="32px" as={tBTCFillBlack} />
      <LabelSm>
        <TBTCText /> - {bridgeProcessToText[bridgeProcess]}
      </LabelSm>
    </Stack>
  )
}
