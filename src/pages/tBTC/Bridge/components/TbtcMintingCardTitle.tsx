import { FC } from "react"
import { Icon, Stack } from "@chakra-ui/react"
import { HiArrowNarrowLeft } from "react-icons/all"
import { LabelSm } from "@threshold-network/components"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep, TbtcMintingType } from "../../../../types/tbtc"

export const TbtcMintingCardTitle: FC<{
  previousStep?: MintingStep
  onPreviousStepClick?: () => void
}> = ({ previousStep, onPreviousStepClick }) => {
  const { mintingType, updateState } = useTbtcState()

  const defaultOnPreviousStepClick = () => {
    updateState("mintingStep", previousStep)
  }

  return (
    <Stack direction="row" mb={8} align={"center"}>
      {previousStep && (
        <Icon
          cursor="pointer"
          onClick={onPreviousStepClick ?? defaultOnPreviousStepClick}
          mt="4px"
          as={HiArrowNarrowLeft}
        />
      )}
      <Icon boxSize="32px" as={tBTCFillBlack} />
      <LabelSm textTransform="uppercase">
        {mintingType === TbtcMintingType.mint && "TBTC - Minting Process"}
        {mintingType === TbtcMintingType.unmint && "TBTC - Unminting Process"}
      </LabelSm>
    </Stack>
  )
}
