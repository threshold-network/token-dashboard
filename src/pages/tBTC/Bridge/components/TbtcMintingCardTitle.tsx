import { FC } from "react"
import { HiArrowNarrowLeft } from "react-icons/all"
import { Icon, Stack, Box, LabelSm } from "@threshold-network/components"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep, TbtcMintingType } from "../../../../types/tbtc"

const mintTypeToText: Record<TbtcMintingType, string> = {
  [TbtcMintingType.mint]: "minting process",
  [TbtcMintingType.unmint]: "unminting process",
}

export const TbtcMintingCardTitle: FC<{
  previousStep?: MintingStep
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ previousStep, onPreviousStepClick }) => {
  const { mintingType } = useTbtcState()

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
        <Box as="span" textTransform="lowercase">
          t
        </Box>
        btc - {mintTypeToText[mintingType]}
      </LabelSm>
    </Stack>
  )
}
