import { FC, useEffect } from "react"
import { Box, Flex, Skeleton, Stack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import { useIsActive } from "../../../../hooks/useIsActive"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { BridgeContractLink } from "../../../../components/tBTC"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName } = useNonEVMConnection()
  const { mintingStep, updateState, btcDepositAddress, utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()

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
    if (!btcDepositAddress || (!chainId && !isNonEVMActive)) {
      return
    }
    dispatch(
      tbtcSlice.actions.findUtxo({
        btcDepositAddress,
        chainId,
        nonEVMChainName,
      })
    )
  }, [btcDepositAddress, account, chainId, dispatch])

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
