import { FC, useEffect, useState } from "react"
import { Box, Flex, H5, Skeleton, Stack } from "@threshold-network/components"
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
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"

const MintingFlowRouterBase = () => {
  const { mintingStep, updateState, btcDepositAddress } = useTbtcState()
  const threshold = useThreshold()
  const [utxo, setUtxo] = useState<UnspentTransactionOutput | undefined>(
    undefined
  )
  const { openModal } = useModal()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (previousStep === MintingStep.ProvideData) {
      openModal(ModalType.GenerateNewDepositAddress)
      return
    }
    updateState("mintingStep", previousStep)
  }

  useEffect(() => {
    const findUtxos = async () => {
      if (btcDepositAddress) {
        const utxos = await threshold.tbtc.findAllUnspentTransactionOutputs(
          btcDepositAddress
        )
        if (utxos && utxos.length > 0) {
          setUtxo(utxos[0])
          // If there is at least one utxo we remove the interval, because we
          // don't want to encourage sending multiple transactions to the same
          // deposit address.
          clearInterval(interval)
        } else {
          // If ther is no utxo then we display the `MakeDeposit` step to the
          // user and still run the interval to check if the funds were sent.
          updateState("mintingStep", MintingStep.Deposit)
        }
      }
    }

    findUtxos()
    const interval = setInterval(async () => {
      await findUtxos()
    }, 10000)

    return () => clearInterval(interval)
  }, [btcDepositAddress])

  useEffect(() => {
    const checkIfUtxoIsRevealed = async () => {
      if (!utxo) return

      const deposit = await threshold.tbtc.getRevealedDeposit(utxo)

      const isDepositRevealed = deposit.revealedAt !== 0

      if (isDepositRevealed) {
        // TODO: clear deposit data in local storage and navigate user to the
        // step 1 (Provide data)
        updateState("mintingStep", MintingStep.MintingSuccess)
      } else {
        updateState("mintingStep", MintingStep.InitiateMinting)
      }
    }
    checkIfUtxoIsRevealed()
  }, [utxo])

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
          utxo={utxo}
          onPreviousStepClick={onPreviousStepClick}
        />
      )
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess onPreviousStepClick={onPreviousStepClick} />
    }
    default:
      return (
        <>
          <TbtcMintingCardTitle
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
