import { FC, useEffect } from "react"
import { BodyLg, Button, H5 } from "@threshold-network/components"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import {
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { useToast } from "../../../../hooks/useToast"
import InfoBox from "../../../../components/InfoBox"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import MintingTransactionDetails from "../components/MintingTransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BigNumber } from "ethers"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { getChainIdentifier } from "../../../../threshold-ts/utils"
import { useRevealDepositTransaction } from "../../../../hooks/tbtc"

const InitiateMintingComponent: FC<{
  utxo: UnspentTransactionOutput
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { addToast, removeToast } = useToast("tbtc-bridge-minting")
  const {
    tBTCMintAmount,
    updateState,
    ethAddress,
    blindingFactor,
    walletPublicKeyHash,
    btcRecoveryAddress,
    refundLocktime,
  } = useTbtcState()
  const threshold = useThreshold()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
  )
  const { value: depositedAmount } = utxo

  useEffect(() => {
    removeToast()
    addToast({
      title: "Deposit received",
      status: "success",
      duration: 5000,
    })
  }, [])

  useEffect(() => {
    const getEstimatedDepositFees = async () => {
      const amount = BigNumber.from(depositedAmount).toString()
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedDepositFees(amount)

      updateState("mintingFee", optimisticMintFee)
      updateState("thresholdNetworkFee", treasuryFee)
      updateState("tBTCMintAmount", amountToMint)
    }

    getEstimatedDepositFees()
  }, [depositedAmount, updateState, threshold])

  const initiateMintTransaction = async () => {
    const depositScriptParameters: DepositScriptParameters = {
      depositor: getChainIdentifier(ethAddress),
      blindingFactor,
      walletPublicKeyHash: walletPublicKeyHash,
      refundPublicKeyHash: decodeBitcoinAddress(btcRecoveryAddress),
      refundLocktime,
    }

    await revealDeposit(utxo, depositScriptParameters)
  }

  return (
    <>
      <BridgeProcessCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <BridgeProcessCardSubTitle
        stepText="Step 3"
        subTitle="Initiate minting"
      />
      <InfoBox variant="modal" mb="6">
        <H5>
          You deposited&nbsp;
          <InlineTokenBalance
            tokenAmount={depositedAmount.toString()}
            tokenSymbol="BTC"
            withSymbol
          />
          &nbsp;and will receive&nbsp;
          <InlineTokenBalance
            tokenAmount={tBTCMintAmount}
            tokenSymbol="tBTC"
            withSymbol
          />
        </H5>
        <BodyLg>
          Receiving tBTC requires a single transaction on Solana and takes
          approximately 2 hours. The bridging can be initiated before you get
          all your Bitcoin deposit confirmations.
        </BodyLg>
      </InfoBox>
      <MintingTransactionDetails />
      <Button
        onClick={initiateMintTransaction}
        isFullWidth
        data-ph-capture-attribute-button-name={
          "Confirm deposit & mint (Step 2)"
        }
      >
        Initiate minting
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
