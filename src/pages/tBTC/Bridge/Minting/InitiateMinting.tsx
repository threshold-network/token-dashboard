import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { BodyLg, Button, H5, Skeleton } from "@threshold-network/components"
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
import { useModal } from "../../../../hooks/useModal"

const InitiateMintingComponent: FC<{
  utxo: BitcoinUtxo
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { tBTCMintAmount, updateState } = useTbtcState()
  const threshold = useThreshold()
  const { closeModal } = useModal()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    // We don't have success modal for deposit reveal so we just closing the
    // current TransactionIsPending modal.
    closeModal()
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
  )

  const depositedAmount = BigNumber.from(utxo.value).toString()

  useEffect(() => {
    const getEstimatedDepositFees = async () => {
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedDepositFees(depositedAmount)

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
        <H5 mb={4}>
          You deposited{" "}
          <InlineTokenBalance
            tokenSymbol="BTC"
            tokenDecimals={8}
            precision={6}
            higherPrecision={8}
            tokenAmount={depositedAmount}
            displayTildeBelow={0}
            withSymbol
          />{" "}
          and will receive{" "}
          <Skeleton isLoaded={!!tBTCMintAmount} maxW="105px" as="span">
            <InlineTokenBalance
              tokenAmount={tBTCMintAmount}
              tokenSymbol="tBTC"
              precision={6}
              higherPrecision={8}
              withSymbol
            />
          </Skeleton>
        </H5>
        <BodyLg>
          Receiving tBTC requires a single transaction on Ethereum and takes
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
