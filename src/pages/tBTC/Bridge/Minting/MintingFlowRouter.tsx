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
import { SupportedChainIds } from "../../../../networks/enums/networks"
import { ChainRegistry } from "../../../../chains/ChainRegistry"
import { ChainType } from "../../../../types/chain"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMPublicKey, nonEVMChainName } =
    useNonEVMConnection()
  const { mintingStep, updateState, btcDepositAddress, utxo, chainName } =
    useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()
  const chainRegistry = ChainRegistry.getInstance()

  // For StarkNet deposits, use non-EVM connection info
  const effectiveAccount = account || nonEVMPublicKey

  // Use chain abstraction to get effective chain ID
  let effectiveChainId = chainId
  if (!effectiveChainId && isNonEVMActive && nonEVMChainName) {
    // For StarkNet, we need to use the actual StarkNet chain ID, not the proxy
    const normalizedChainName = nonEVMChainName.toLowerCase()
    if (normalizedChainName === "starknet") {
      // Use StarkNet Sepolia chain ID directly
      effectiveChainId = "0x534e5f5345504f4c4941" as any
    } else {
      // For other non-EVM chains, use the registry
      effectiveChainId = chainRegistry.getEffectiveChainId(
        "",
        normalizedChainName
      )
    }
  }

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
    console.log("MintingFlowRouter useEffect:", {
      btcDepositAddress,
      account,
      chainId,
      effectiveAccount,
      effectiveChainId,
      isNonEVMActive,
      chainName,
      nonEVMChainName,
      mintingStep,
    })

    if (!btcDepositAddress || !effectiveAccount || !effectiveChainId) {
      console.log(
        "MintingFlowRouter - missing required data, not dispatching findUtxo",
        {
          hasBtcAddress: !!btcDepositAddress,
          hasAccount: !!effectiveAccount,
          hasChainId: !!effectiveChainId,
        }
      )
      return
    }

    console.log("MintingFlowRouter - dispatching findUtxo action")
    dispatch(
      tbtcSlice.actions.findUtxo({
        btcDepositAddress,
        chainId: effectiveChainId,
      })
    )
  }, [btcDepositAddress, effectiveAccount, effectiveChainId, dispatch])

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
