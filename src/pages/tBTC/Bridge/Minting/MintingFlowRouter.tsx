import { FC, useEffect } from "react"
import { Box, Flex, Skeleton, Stack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { BridgeContractLink } from "../../../../components/tBTC"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { useIsActive } from "../../../../hooks/useIsActive"
import { useIsSdkInitializing } from "../../../../contexts/ThresholdContext"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account } = useIsActive()
  const { mintingStep, updateState, btcDepositAddress, utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()
  const { isSdkInitializing, isSdkInitializedWithSigner } =
    useIsSdkInitializing()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (mintingStep === MintingStep.MintingSuccess) {
      updateState("mintingStep", MintingStep.ProvideData)
      removeDepositData()
      return
    }
    if (previousStep === MintingStep.ProvideData) {
      openModal(ModalType.GenerateNewDepositAddress)
      return
    }
    updateState("mintingStep", previousStep)
  }

  useEffect(() => {
    if (
      !btcDepositAddress ||
      !account ||
      isSdkInitializing ||
      !isSdkInitializedWithSigner
    ) {
      return
    }

    dispatch(
      tbtcSlice.actions.findUtxo({ btcDepositAddress, depositor: account })
    )
  }, [
    btcDepositAddress,
    account,
    dispatch,
    isSdkInitializing,
    isSdkInitializedWithSigner,
  ])

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.InitiateMinting: {
      return (
        <InitiateMinting
          utxo={utxo!}
          onPreviousStepClick={onPreviousStepClick}
        />
      )
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return (
        <>
          <BridgeProcessCardTitle
            previousStep={MintingStep.ProvideData}
            onPreviousStepClick={onPreviousStepClick}
          />
          <Stack>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="100px" />
          </Stack>
        </>
      )
  }
}

export const MintingFlowRouter: FC = () => {
  return (
    <Flex flexDirection="column">
      <>
        <MintingFlowRouterBase />
        <Box as="p" textAlign="center" mt="6">
          <BridgeContractLink />
        </Box>
      </>
    </Flex>
  )
}
