import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { BodyLg, Button, H5 } from "@threshold-network/components"
import { FC, useEffect } from "react"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import InfoBox from "../../../../components/InfoBox"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import MintingTransactionDetails from "../components/MintingTransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BigNumber } from "ethers"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useRevealDepositTransaction } from "../../../../hooks/tbtc"
import { Toast } from "../../../../components/Toast"

const InitiateMintingComponent: FC<{
  utxo: BitcoinUtxo
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { tBTCMintAmount, updateState } = useTbtcState()
  const threshold = useThreshold()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
  )
  const { value: depositedAmount } = utxo

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
    await revealDeposit(utxo)
  }

  return (
    <>
      <Toast title="Deposit received" status="success" duration={3000} />
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
        Bridge
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
