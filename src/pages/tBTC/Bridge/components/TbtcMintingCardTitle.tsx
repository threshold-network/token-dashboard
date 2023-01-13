import { FC } from "react"
import { Icon, Stack } from "@chakra-ui/react"
import { HiArrowNarrowLeft } from "react-icons/all"
import { LabelSm } from "@threshold-network/components"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep, TbtcMintingType } from "../../../../types/tbtc"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"

export const TbtcMintingCardTitle: FC<{ previousStep?: MintingStep }> = ({
  previousStep,
}) => {
  const { mintingType, updateState } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (previousStep === MintingStep.ProvideData) {
      removeDepositDataFromLocalStorage()

      // remove deposit data from the state,
      updateState("ethAddress", undefined)
      updateState("blindingFactor", undefined)
      updateState("btcRecoveryAddress", undefined)
      updateState("walletPublicKeyHash", undefined)
      updateState("refundLocktime", undefined)
      updateState("btcDepositAddress", undefined)
    }
    updateState("mintingStep", previousStep)
  }

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
      <LabelSm textTransform="uppercase">
        {mintingType === TbtcMintingType.mint && "TBTC - Minting Process"}
        {mintingType === TbtcMintingType.unmint && "TBTC - Unminting Process"}
      </LabelSm>
    </Stack>
  )
}
