import { FC } from "react"
import { Box, Button, Flex, H5 } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"
import { useWeb3React } from "@web3-react/core"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"

const MintingFlowRouterBase = () => {
  const { mintingStep, updateState } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (previousStep === MintingStep.ProvideData) {
      clearDepositData()
    }
    updateState("mintingStep", previousStep)
  }

  const clearDepositData = () => {
    removeDepositDataFromLocalStorage()

    // remove deposit data from the state,
    updateState("ethAddress", undefined)
    updateState("blindingFactor", undefined)
    updateState("btcRecoveryAddress", undefined)
    updateState("walletPublicKeyHash", undefined)
    updateState("refundLocktime", undefined)
    updateState("btcDepositAddress", undefined)
  }

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.InitiateMinting: {
      return <InitiateMinting onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess onPreviousStepClick={onPreviousStepClick} />
    }
    default:
      return null
  }
}

export const MintingFlowRouter: FC = () => {
  const brdigeContractAddress = useTBTCBridgeContractAddress()
  const { active } = useWeb3React()

  return (
    <Flex flexDirection="column">
      {active ? (
        <MintingFlowRouterBase />
      ) : (
        <>
          <H5 align={"center"}>Connect wallet to mint tBTC</H5>
          <SubmitTxButton />
        </>
      )}
      <Box as="p" textAlign="center" mt="6">
        <ViewInBlockExplorer
          id={brdigeContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Bridge Contract"
        />
      </Box>
    </Flex>
  )
}
